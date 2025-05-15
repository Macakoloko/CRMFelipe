import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, ChevronDown, Search, Clock, ArrowUpRight, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TaskStatus, getClientById, getTagById, getPriorityColor, tags } from '@/lib/data';
import { cn } from '@/lib/utils';
import TaskModal from '@/components/TaskModal';
import ProjectModal from '@/components/ProjectModal';
import TaskCard from '@/components/TaskCard';
import { db } from '@/lib/db';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanColumn {
  id: TaskStatus | string;
  title: string;
  taskIds: number[];
  color: string;
}

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [tasks, setTasks] = useState(db.getTasks());
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: 'todo', title: 'A fazer', taskIds: tasks.filter(task => task.status === 'todo').map(task => task.id), color: '#6B7280' },
    { id: 'doing', title: 'Em andamento', taskIds: tasks.filter(task => task.status === 'doing').map(task => task.id), color: '#3B82F6' },
    { id: 'review', title: 'Em revisão', taskIds: tasks.filter(task => task.status === 'review').map(task => task.id), color: '#F59E0B' },
    { id: 'done', title: 'Concluído', taskIds: tasks.filter(task => task.status === 'done').map(task => task.id), color: '#10B981' },
  ]);
  
  // Carregar tarefas do banco de dados ao iniciar
  useEffect(() => {
    const dbTasks = db.getTasks();
    setTasks(dbTasks);
    
    // Atualizar as colunas com as tarefas do banco
    setColumns([
      { id: 'todo', title: 'A fazer', taskIds: dbTasks.filter(task => task.status === 'todo').map(task => task.id), color: '#6B7280' },
      { id: 'doing', title: 'Em andamento', taskIds: dbTasks.filter(task => task.status === 'doing').map(task => task.id), color: '#3B82F6' },
      { id: 'review', title: 'Em revisão', taskIds: dbTasks.filter(task => task.status === 'review').map(task => task.id), color: '#F59E0B' },
      { id: 'done', title: 'Concluído', taskIds: dbTasks.filter(task => task.status === 'done').map(task => task.id), color: '#10B981' },
    ]);
  }, []);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null);
  const [deleteTask, setDeleteTask] = useState<number | null>(null);
  const [deleteColumn, setDeleteColumn] = useState<string | null>(null);
  
  const filteredTasks = tasks.filter(task => {
    let matchesSearch = true;
    let matchesTeam = true;

    if (searchQuery) {
      matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (getClientById(task.clientId)?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    }

    if (selectedTeam !== null) {
      matchesTeam = task.tagIds.includes(selectedTeam);
    }

    return matchesSearch && matchesTeam;
  });
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;
    
    const newColumns = [...columns];
    
    const taskId = parseInt(draggableId);
    
    // Atualizar colunas
    const sourceColumnIndex = newColumns.findIndex(col => col.id === source.droppableId);
    newColumns[sourceColumnIndex] = {
      ...sourceColumn,
      taskIds: sourceColumn.taskIds.filter(id => id !== taskId)
    };
    
    const destColumnIndex = newColumns.findIndex(col => col.id === destination.droppableId);
    const newTaskIds = [...destColumn.taskIds];
    newTaskIds.splice(destination.index, 0, taskId);
    newColumns[destColumnIndex] = {
      ...destColumn,
      taskIds: newTaskIds
    };
    
    // Atualizar status no banco de dados
    if (destination.droppableId === 'todo' || 
        destination.droppableId === 'doing' || 
        destination.droppableId === 'review' || 
        destination.droppableId === 'done') {
      const newStatus = destination.droppableId as TaskStatus;
      const updatedTask = db.updateTaskStatus(taskId, newStatus);
      if (updatedTask) {
        setTasks(db.getTasks());
      }
    }
    
    setColumns(newColumns);
  };
  
  const handleCreateTask = (taskData: any) => {
    // Adicionar tarefa no banco de dados
    const newTask = db.addTask(taskData);
    setTasks(db.getTasks());
    
    // Adicionar à coluna apropriada
    const targetColumn = columns.find(col => col.id === taskData.status);
    if (targetColumn) {
      setColumns(columns.map(col => 
        col.id === targetColumn.id 
          ? { ...col, taskIds: [...col.taskIds, newTask.id] }
          : col
      ));
    }
  };
  
  const handleUpdateTask = (taskData: any) => {
    // Atualizar tarefa no banco de dados
    const oldTask = tasks.find(t => t.id === taskData.id);
    const updatedTask = db.updateTask(taskData.id, taskData);
    
    if (updatedTask) {
      setTasks(db.getTasks());
      
      // Atualizar colunas se o status mudou
      if (oldTask && oldTask.status !== taskData.status) {
        const newColumns = columns.map(col => {
          if (col.id === oldTask.status) {
            return { ...col, taskIds: col.taskIds.filter(id => id !== taskData.id) };
          }
          if (col.id === taskData.status) {
            return { ...col, taskIds: [...col.taskIds, taskData.id] };
          }
          return col;
        });
        setColumns(newColumns);
      }
    }
    
    setEditingTask(null);
  };
  
  const handleDeleteTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Remover tarefa do banco de dados
    const deleted = db.deleteTask(taskId);
    if (deleted) {
      setTasks(db.getTasks());
      
      // Remover da coluna
      const newColumns = columns.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== taskId)
      }));
      setColumns(newColumns);
    }
    
    setDeleteTask(null);
  };
  
  const handleCreateColumn = (data: { title: string; color: string }) => {
    const newColumn: KanbanColumn = {
      id: `column-${Date.now()}`,
      title: data.title,
      color: data.color,
      taskIds: []
    };
    setColumns([...columns, newColumn]);
  };
  
  const handleUpdateColumn = (data: { title: string; color: string }) => {
    if (!editingColumn) return;
    
    const updatedColumns = columns.map(col =>
      col.id === editingColumn.id
        ? { ...col, title: data.title, color: data.color }
        : col
    );
    setColumns(updatedColumns);
    setEditingColumn(null);
  };
  
  const handleDeleteColumn = (columnId: string) => {
    // Move tasks to 'todo' column or first available column
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    const targetColumn = columns.find(col => col.id === 'todo') || columns[0];
    if (targetColumn && targetColumn.id !== columnId) {
      const updatedColumns = columns.map(col => {
        if (col.id === targetColumn.id) {
          return { ...col, taskIds: [...col.taskIds, ...column.taskIds] };
        }
        return col;
      });
      setColumns(updatedColumns.filter(col => col.id !== columnId));
    } else {
      setColumns(columns.filter(col => col.id !== columnId));
    }
    
    setDeleteColumn(null);
  };
  
  return (
    <div className="p-6 animate-fade-in h-screen overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projetos</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas tarefas com arrastar e soltar</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass flex items-center px-3 py-2 rounded-lg w-[200px] sm:w-[250px]">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Buscar tarefas..." 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <Button 
              variant="outline"
              className={selectedTeam !== null ? 'bg-primary/20' : ''}
              onClick={() => setSelectedTeam(selectedTeam !== null ? null : 6)}
            >
              <span className="mr-2">Equipe</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            {selectedTeam !== null && (
              <div className="absolute top-full mt-1 right-0 z-10 glass-dark border border-border/40 rounded-lg p-2 w-[200px]">
                <div 
                  className={`
                    px-3 py-2 text-sm rounded-md cursor-pointer mb-1
                    ${selectedTeam === null ? 'bg-primary/20' : 'hover:bg-muted/20'}
                  `}
                  onClick={() => setSelectedTeam(null)}
                >
                  Todas as equipes
                </div>
                
                {tags.filter(tag => tag.id >= 6 && tag.id <= 9).map(team => (
                  <div 
                    key={team.id} 
                    className={`
                      px-3 py-2 text-sm rounded-md cursor-pointer flex items-center gap-2
                      ${selectedTeam === team.id ? 'bg-primary/20' : 'hover:bg-muted/20'}
                    `}
                    onClick={() => setSelectedTeam(team.id)}
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: team.color }}
                    />
                    <span>{team.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova tarefa</span>
            <span className="sm:hidden">Nova</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              setEditingColumn(null);
              setIsProjectModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Nova coluna</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full pb-4">
            {columns.map(column => (
              <div key={column.id} className="glass-dark rounded-xl flex-shrink-0 w-80">
                <div className="p-4 border-b border-border/20">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: column.color }}
                      />
                      <h3 className="font-medium">{column.title}</h3>
                      <span className="text-sm text-muted-foreground">({column.taskIds.length})</span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEditingColumn(column);
                          setIsProjectModalOpen(true);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => setDeleteColumn(column.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "p-3 min-h-[calc(100vh-230px)] overflow-y-auto",
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      )}
                    >
                      {column.taskIds.map((taskId, index) => {
                        const task = filteredTasks.find(t => t.id === taskId);
                        if (!task) return null;
                        
                        return (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-3"
                              >
                                <TaskCard 
                                  task={task}
                                  onEdit={() => {
                                    setEditingTask(task);
                                    setIsTaskModalOpen(true);
                                  }}
                                  onDelete={() => setDeleteTask(task.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingColumn(null);
        }}
        onSubmit={editingColumn ? handleUpdateColumn : handleCreateColumn}
        initialData={editingColumn}
      />

      <AlertDialog open={deleteTask !== null} onOpenChange={() => setDeleteTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTask && handleDeleteTask(deleteTask)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteColumn !== null} onOpenChange={() => setDeleteColumn(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta coluna? As tarefas serão movidas para a coluna "A fazer".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteColumn && handleDeleteColumn(deleteColumn)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
