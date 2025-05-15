import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initialClients, TaskStatus, TaskPriority, ContentType, tags } from '@/lib/data';
import { useLanguage } from '@/lib/LanguageContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
  initialData?: {
    id?: number;
    title: string;
    description: string;
    clientId: number;
    status: TaskStatus;
    priority: TaskPriority;
    contentType: ContentType;
    dueDate: Date;
    assignedTo: string;
    tagIds: number[];
  };
}

export default function TaskModal({ isOpen, onClose, onSubmit, initialData }: TaskModalProps) {
  const { t } = useLanguage();
  
  const [formData, setFormData] = React.useState(
    initialData || {
      title: '',
      description: '',
      clientId: initialClients[0].id,
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      contentType: 'post' as ContentType,
      dueDate: new Date(),
      assignedTo: '',
      tagIds: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? t('editTask') : t('newTask')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t('title')}</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={t('enterTaskTitle')}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t('description')}</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('enterTaskDescription')}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t('client')}</label>
              <Select
                value={formData.clientId.toString()}
                onValueChange={(value) => handleChange('clientId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectClient')} />
                </SelectTrigger>
                <SelectContent>
                  {initialClients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t('status')}</label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">{t('todo')}</SelectItem>
                  <SelectItem value="doing">{t('doing')}</SelectItem>
                  <SelectItem value="review">{t('review')}</SelectItem>
                  <SelectItem value="done">{t('done')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t('priority')}</label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectPriority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('low')}</SelectItem>
                  <SelectItem value="medium">{t('medium')}</SelectItem>
                  <SelectItem value="high">{t('high')}</SelectItem>
                  <SelectItem value="urgent">{t('urgent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t('contentType')}</label>
              <Select
                value={formData.contentType}
                onValueChange={(value) => handleChange('contentType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">{t('post')}</SelectItem>
                  <SelectItem value="story">{t('story')}</SelectItem>
                  <SelectItem value="reels">{t('reels')}</SelectItem>
                  <SelectItem value="ad">{t('ad')}</SelectItem>
                  <SelectItem value="video">{t('video')}</SelectItem>
                  <SelectItem value="blog">{t('blog')}</SelectItem>
                  <SelectItem value="link">{t('link')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t('dueDate')}</label>
              <Input
                type="date"
                value={formData.dueDate.toISOString().split('T')[0]}
                onChange={(e) => handleChange('dueDate', new Date(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t('assignedTo')}</label>
              <Input
                value={formData.assignedTo}
                onChange={(e) => handleChange('assignedTo', e.target.value)}
                placeholder={t('responsibleName')}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t('team')}</label>
              <Select
                value={formData.tagIds.find(id => id >= 6 && id <= 9)?.toString() || ''}
                onValueChange={(value) => {
                  const tagId = parseInt(value);
                  const currentTags = formData.tagIds.filter(id => id < 6 || id > 9);
                  handleChange('tagIds', [...currentTags, tagId]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectTeam')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">{t('designTeam')}</SelectItem>
                  <SelectItem value="7">{t('socialTeam')}</SelectItem>
                  <SelectItem value="8">{t('contentTeam')}</SelectItem>
                  <SelectItem value="9">{t('mediaTeam')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit">
              {initialData ? t('save') : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 