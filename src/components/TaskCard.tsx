import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, Edit, Trash2 } from 'lucide-react';
import { TaskStatus, TaskPriority, ContentType, getClientById, getPriorityColor, getTagById } from '@/lib/data';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    clientId: number;
    status: TaskStatus;
    priority: TaskPriority;
    contentType: ContentType;
    dueDate: Date;
    assignedTo: string;
    comments: Array<{ user: string; message: string; timestamp: Date }>;
    tagIds: number[];
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const client = getClientById(task.clientId);
  const formattedDate = new Date(task.dueDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });

  return (
    <Card className="p-4 glass hover:glass-hover transition-all cursor-pointer group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {client && (
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: client.primaryColor }}
              />
            )}
            <span className="text-sm font-medium truncate">
              {client?.name}
            </span>
          </div>
          
          <h3 className="font-medium mb-1 truncate">{task.title}</h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority === 'low' ? 'Baixa' :
               task.priority === 'medium' ? 'Média' :
               task.priority === 'high' ? 'Alta' : 'Urgente'}
            </Badge>
            
            {task.tagIds.map(tagId => {
              const tag = getTagById(tagId);
              if (!tag) return null;
              return (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  style={{ 
                    color: tag.color,
                    borderColor: tag.color
                  }}
                >
                  {tag.name}
                </Badge>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              {task.assignedTo.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 rounded-lg hover:bg-muted/20 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 rounded-lg hover:bg-muted/20 transition-colors text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
