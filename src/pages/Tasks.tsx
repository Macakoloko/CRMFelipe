import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskCard from '@/components/TaskCard';
import { initialClients, TaskStatus, getPriorityColor, getStatusColor, tags } from '@/lib/data';
import { Filter, Plus, Search, ChevronDown, Trash2, Edit } from 'lucide-react';
import TaskModal from '@/components/TaskModal';
import { Button } from '@/components/ui/button';
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

export default function Tasks() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [tasks, setTasks] = useState(db.getTasks());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [deleteTask, setDeleteTask] = useState<number | null>(null);
  
  // Carregar tarefas do banco de dados ao iniciar
  useEffect(() => {
    setTasks(db.getTasks());
  }, []);
  
  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    let matchesClient = true;
    let matchesStatus = true;
    let matchesTeam = true;
    
    if (selectedClient !== null) {
      matchesClient = task.clientId === selectedClient;
    }
    
    if (selectedStatus !== null) {
      matchesStatus = task.status === selectedStatus;
    }

    if (selectedTeam !== null) {
      matchesTeam = task.tagIds.includes(selectedTeam);
    }
    
    return matchesClient && matchesStatus && matchesTeam;
  });
  
  // Group tasks by status
  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    doing: filteredTasks.filter(task => task.status === 'doing'),
    review: filteredTasks.filter(task => task.status === 'review'),
    done: filteredTasks.filter(task => task.status === 'done')
  };
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as TaskStatus;
    
    // Atualizar status no banco de dados
    const updatedTask = db.updateTaskStatus(taskId, newStatus);
    if (updatedTask) {
      setTasks(db.getTasks());
    }
  };

  const handleCreateTask = (taskData: any) => {
    // Adicionar tarefa no banco de dados
    const newTask = db.addTask(taskData);
    setTasks(db.getTasks());
  };

  const handleUpdateTask = (taskData: any) => {
    // Atualizar tarefa no banco de dados
    const updatedTask = db.updateTask(taskData.id, taskData);
    if (updatedTask) {
      setTasks(db.getTasks());
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: number) => {
    // Remover tarefa do banco de dados
    const deleted = db.deleteTask(taskId);
    if (deleted) {
      setTasks(db.getTasks());
    }
    setDeleteTask(null);
  };

  const handleEditClick = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-muted-foreground mt-1">Gerencie e organize as demandas de conteúdo</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass flex items-center px-3 py-2 rounded-lg w-[200px]">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="Buscar tarefas..." 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="relative">
            <button 
              className={`
                px-3 py-2 rounded-lg flex items-center gap-2 
                ${activeFilter === 'client' ? 'bg-primary/20' : 'glass'}
              `}
              onClick={() => setActiveFilter(activeFilter === 'client' ? null : 'client')}
            >
              <span>Cliente</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeFilter === 'client' && (
              <div className="absolute top-full mt-1 right-0 z-10 glass-dark border border-border/40 rounded-lg p-2 w-[200px]">
                <div 
                  className={`
                    px-3 py-2 text-sm rounded-md cursor-pointer mb-1
                    ${selectedClient === null ? 'bg-primary/20' : 'hover:bg-muted/20'}
                  `}
                  onClick={() => setSelectedClient(null)}
                >
                  Todos os clientes
                </div>
                
                {initialClients.map(client => (
                  <div 
                    key={client.id} 
                    className={`
                      px-3 py-2 text-sm rounded-md cursor-pointer flex items-center gap-2
                      ${selectedClient === client.id ? 'bg-primary/20' : 'hover:bg-muted/20'}
                    `}
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: client.primaryColor }}
                    />
                    <span>{client.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              className={`
                px-3 py-2 rounded-lg flex items-center gap-2 
                ${activeFilter === 'status' ? 'bg-primary/20' : 'glass'}
              `}
              onClick={() => setActiveFilter(activeFilter === 'status' ? null : 'status')}
            >
              <span>Status</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeFilter === 'status' && (
              <div className="absolute top-full mt-1 right-0 z-10 glass-dark border border-border/40 rounded-lg p-2 w-[200px]">
                <div 
                  className={`
                    px-3 py-2 text-sm rounded-md cursor-pointer mb-1
                    ${selectedStatus === null ? 'bg-primary/20' : 'hover:bg-muted/20'}
                  `}
                  onClick={() => setSelectedStatus(null)}
                >
                  Todos os status
                </div>
                
                {(['todo', 'doing', 'review', 'done'] as TaskStatus[]).map(status => (
                  <div 
                    key={status} 
                    className={`
                      px-3 py-2 text-sm rounded-md cursor-pointer flex items-center gap-2
                      ${selectedStatus === status ? 'bg-primary/20' : 'hover:bg-muted/20'}
                    `}
                    onClick={() => setSelectedStatus(status)}
                  >
                    <div className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(status)}`}>
                      {status === 'todo' ? 'A fazer' : 
                       status === 'doing' ? 'Em andamento' : 
                       status === 'review' ? 'Em revisão' : 'Concluído'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              className={`
                px-3 py-2 rounded-lg flex items-center gap-2 
                ${activeFilter === 'team' ? 'bg-primary/20' : 'glass'}
              `}
              onClick={() => setActiveFilter(activeFilter === 'team' ? null : 'team')}
            >
              <span>Equipe</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeFilter === 'team' && (
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Nova tarefa</span>
          </Button>
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
          {(['todo', 'doing', 'review', 'done'] as TaskStatus[]).map(status => (
            <div key={status} className="glass-dark rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(status) }} />
                  <h3 className="font-medium">
                    {status === 'todo' ? 'A fazer' : 
                     status === 'doing' ? 'Em andamento' : 
                     status === 'review' ? 'Em revisão' : 'Concluído'}
                  </h3>
                  <span className="text-sm text-muted-foreground">({tasksByStatus[status].length})</span>
                </div>
              </div>
              
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                  >
                    {tasksByStatus[status].map((task, index) => (
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
                              onEdit={() => handleEditClick(task)}
                              onDelete={() => setDeleteTask(task.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
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
    </div>
  );
}
