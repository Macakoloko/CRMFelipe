import React from 'react';
import { MoreHorizontal, CheckCircle2, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface ClientCardProps {
  client: {
    name: string;
    company: string;
    email: string;
    phone: string;
    status: string;
    projectsCount: number;
    tasksCompleted: number;
    tasksPending: number;
  };
}

export default function ClientCard({ client }: ClientCardProps) {
  const { t } = useLanguage();
  
  return (
    <div className="glass-dark rounded-xl p-6">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            {client.name.charAt(0)}
          </div>
          
          <div>
            <h3 className="font-medium text-lg">{client.name}</h3>
            <p className="text-sm text-muted-foreground">{client.company}</p>
          </div>
        </div>
        
        <div>
          <button className="p-2 rounded-full hover:bg-muted/30">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <span className={`px-2 py-1 rounded-full text-xs ${
          client.status === 'active' ? 'bg-green-500/20 text-green-200' : 
          client.status === 'pending' ? 'bg-yellow-500/20 text-yellow-200' : 
          'bg-red-500/20 text-red-200'
        }`}>
          {client.status === 'active' ? t('active') : 
           client.status === 'pending' ? t('pending') : 
           t('inactive')}
        </span>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">{t('projects')}</span>
          <span className="text-sm font-medium">{client.projectsCount}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-sm">{client.tasksCompleted} {t('completedTasks')}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span className="text-sm">{client.tasksPending} {t('pendingTasks')}</span>
        </div>
      </div>
    </div>
  );
}
