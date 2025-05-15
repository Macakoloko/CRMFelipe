import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define uma interface para o tipo de cliente
interface ClientData {
  id?: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  projectsCount?: number;
  tasksCompleted?: number;
  tasksPending?: number;
  primaryColor?: string;
  secondaryColor?: string;
  tags?: string[];
}

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientData) => void;
  initialData?: ClientData;
}

export default function ClientModal({ isOpen, onClose, onSubmit, initialData }: ClientModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ClientData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'active',
    projectsCount: 0,
    tasksCompleted: 0,
    tasksPending: 0,
    primaryColor: '#4CAF50',
    secondaryColor: '#81C784',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure tags is always an array
        tags: initialData.tags || []
      });
    } else {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'active',
        projectsCount: 0,
        tasksCompleted: 0,
        tasksPending: 0,
        primaryColor: '#4CAF50',
        secondaryColor: '#81C784',
        tags: []
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? t('editClient') : t('newClient')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('clientName')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t('clientName')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">{t('company')}</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder={t('company')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={t('email')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('phone')}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={t('phone')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t('status')}</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="pending">{t('pending')}</SelectItem>
                <SelectItem value="inactive">{t('inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">{t('primaryColor')}</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-12 h-12 p-1 rounded-lg"
                />
                <Input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">{t('secondaryColor')}</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-12 h-12 p-1 rounded-lg"
                />
                <Input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">{t('tags')}</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={t('addTag')}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                {t('add')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData.tags || []).map((tag, index) => (
                <div
                  key={index}
                  className="bg-primary/20 text-primary px-2 py-1 rounded-md flex items-center gap-2"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-primary hover:text-primary/80"
                  >
                    ×
                  </button>
                </div>
              ))}
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