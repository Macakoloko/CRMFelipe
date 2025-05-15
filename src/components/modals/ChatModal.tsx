import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChat, ChannelType } from '@/lib/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  channelType: ChannelType;
  initialData?: {
    id: string;
    name: string;
    avatar?: string;
    participants: string[];
  };
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  mode,
  channelType,
  initialData
}) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [avatar, setAvatar] = React.useState(initialData?.avatar || '');
  const [participants, setParticipants] = React.useState<string[]>(initialData?.participants || []);
  const { createChannel, updateChannel } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const channelData = {
      name,
      type: channelType,
      avatar,
      participants,
      unreadCount: 0,
      isMuted: false,
    };

    if (mode === 'create') {
      await createChannel(channelData);
    } else if (initialData) {
      await updateChannel(initialData.id, channelData);
    }

    onClose();
    setName('');
    setAvatar('');
    setParticipants([]);
  };

  const title = mode === 'create' 
    ? `Criar novo ${channelType === 'direct' ? 'chat direto' : channelType.slice(0, -1)}`
    : `Editar ${channelType === 'direct' ? 'chat direto' : channelType.slice(0, -1)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Nome do ${channelType === 'direct' ? 'usuário' : channelType.slice(0, -1)}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="avatar"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="URL do avatar (opcional)"
              />
              {avatar && (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatar} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>

          {channelType !== 'direct' && (
            <div className="space-y-2">
              <Label>Participantes</Label>
              <Select
                value={participants[0]}
                onValueChange={(value) => {
                  if (!participants.includes(value)) {
                    setParticipants([...participants, value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Adicionar participante" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add your user list here */}
                  <SelectItem value="user1">Usuário 1</SelectItem>
                  <SelectItem value="user2">Usuário 2</SelectItem>
                  <SelectItem value="user3">Usuário 3</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {participants.map((participant) => (
                  <div
                    key={participant}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                  >
                    <span>{participant}</span>
                    <button
                      type="button"
                      onClick={() => setParticipants(participants.filter(p => p !== participant))}
                      className="text-primary hover:text-primary/80"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Criar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal; 