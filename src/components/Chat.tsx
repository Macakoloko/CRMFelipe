import React, { useState, useRef, useEffect } from 'react';
import { useChat, ChannelType } from '../lib/ChatContext';
import { 
  SendIcon, 
  SmileIcon, 
  PaperclipIcon, 
  BellIcon, 
  BellOffIcon, 
  SearchIcon,
  UsersIcon,
  BriefcaseIcon,
  MessageSquareIcon,
  UserIcon,
  PlusCircleIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  WifiIcon,
  WifiOffIcon
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ChatModal from './modals/ChatModal';
import { useToast } from '@/components/ui/use-toast';

const Chat: React.FC = () => {
  const { 
    messages, 
    channels, 
    currentChannel, 
    currentUser, 
    sendMessage, 
    setCurrentChannel,
    addReaction,
    toggleMuteChannel,
    deleteChannel,
    isConnected
  } = useChat();
  
  const [newMessage, setNewMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<ChannelType>('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingChannel, setEditingChannel] = useState<typeof currentChannel>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isSending) {
      try {
        setIsSending(true);
        await sendMessage(newMessage.trim());
        setNewMessage('');
      } catch (error) {
        toast({
          title: "Erro ao enviar mensagem",
          description: "Não foi possível enviar sua mensagem. Por favor, tente novamente.",
          variant: "destructive"
        });
        console.error('Error sending message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const filteredChannels = channels.filter(channel => {
    const matchesType = channel.type === activeFilter;
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCreateChannel = () => {
    setModalMode('create');
    setEditingChannel(null);
    setIsModalOpen(true);
  };

  const handleEditChannel = (channel: typeof currentChannel) => {
    setModalMode('edit');
    setEditingChannel(channel);
    setIsModalOpen(true);
  };

  const handleDeleteChannel = async (channelId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este canal?')) {
      await deleteChannel(channelId);
      toast({
        title: 'Canal excluído',
        description: 'O canal foi excluído com sucesso.',
      });
    }
  };

  return (
    <>
      <div className="flex h-[600px] bg-background/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-border/40">
        {/* Sidebar */}
        <div className="w-80 border-r border-border/40 flex flex-col bg-background/50">
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Chat</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {isConnected ? (
                      <WifiIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOffIcon className="w-4 h-4 text-destructive animate-pulse" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isConnected ? 'Conectado' : 'Desconectado'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Channel Type Filters */}
            <div className="flex space-x-0.5 mb-4 bg-background/50 p-0.5 rounded-lg">
              <button
                onClick={() => setActiveFilter('clients')}
                className={`flex items-center justify-center flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors
                  ${activeFilter === 'clients' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-primary'}`}
              >
                <BriefcaseIcon className="w-3.5 h-3.5 mr-1" />
                Clientes
              </button>
              <button
                onClick={() => setActiveFilter('projects')}
                className={`flex items-center justify-center flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors
                  ${activeFilter === 'projects' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-primary'}`}
              >
                <MessageSquareIcon className="w-3.5 h-3.5 mr-1" />
                Projetos
              </button>
              <button
                onClick={() => setActiveFilter('groups')}
                className={`flex items-center justify-center flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors
                  ${activeFilter === 'groups' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-primary'}`}
              >
                <UsersIcon className="w-3.5 h-3.5 mr-1" />
                Grupos
              </button>
              <button
                onClick={() => setActiveFilter('direct')}
                className={`flex items-center justify-center flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors
                  ${activeFilter === 'direct' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-primary'}`}
              >
                <UserIcon className="w-3.5 h-3.5 mr-1" />
                DMs
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <Input
                type="text"
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 border-border/40 placeholder:text-muted-foreground focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Channel List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {activeFilter === 'clients' ? 'Clientes' :
                   activeFilter === 'projects' ? 'Projetos' :
                   activeFilter === 'groups' ? 'Grupos' : 'Mensagens Diretas'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-primary hover:text-primary/80"
                  onClick={handleCreateChannel}
                >
                  <PlusCircleIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="group relative"
                  >
                    <button
                      onClick={() => setCurrentChannel(channel)}
                      className={`w-full flex items-center p-2 rounded-lg transition-colors
                        ${currentChannel?.id === channel.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-muted/50 text-foreground'}`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={channel.avatar} />
                        <AvatarFallback>{channel.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{channel.name}</span>
                          {channel.unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {channel.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {channel.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">
                            {channel.lastMessage}
                          </p>
                        )}
                      </div>
                    </button>
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditChannel(channel)}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteChannel(channel.id)}
                            className="text-destructive"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        {currentChannel ? (
          <div className="flex-1 flex flex-col bg-background/50">
            {/* Channel Header */}
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentChannel.avatar} />
                  <AvatarFallback>{currentChannel.name[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h3 className="font-semibold text-foreground">{currentChannel.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentChannel.participants.length} participantes
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                  <SearchIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleMuteChannel(currentChannel.id)}
                  className="text-primary hover:text-primary/80"
                >
                  {currentChannel.isMuted ? (
                    <BellOffIcon className="w-4 h-4" />
                  ) : (
                    <BellIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .filter(msg => msg.channelId === currentChannel.id)
                .map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === currentUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === currentUser
                          ? 'bg-primary text-primary-foreground ml-12'
                          : 'bg-muted text-foreground mr-12'
                      }`}
                    >
                      {message.senderId !== currentUser && (
                        <p className="text-xs font-medium mb-1">
                          {message.senderId}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-75">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex space-x-1">
                            {message.reactions.map((reaction, index) => (
                              <button
                                key={index}
                                onClick={() => addReaction(message.id, reaction.emoji)}
                                className={`px-1.5 py-0.5 rounded-full text-xs
                                  ${message.senderId === currentUser
                                    ? 'bg-blue-400 hover:bg-blue-300'
                                    : 'bg-gray-200 hover:bg-gray-300'}`}
                              >
                                {reaction.emoji} {reaction.users.length}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border/40">
              <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Button type="button" variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                    <PaperclipIcon className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                    <SmileIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Mensagem para ${currentChannel.name}...`}
                    className="flex-1 bg-background/50 border-border/40 focus-visible:ring-primary"
                    disabled={!isConnected || isSending}
                  />
                  <Button 
                    type="submit" 
                    disabled={!newMessage.trim() || !isConnected || isSending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <SendIcon className={`w-4 h-4 ${isSending ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
                {!isConnected && (
                  <p className="text-xs text-destructive flex items-center">
                    <WifiOffIcon className="w-3 h-3 mr-1" />
                    Desconectado do servidor. Tentando reconectar...
                  </p>
                )}
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background/50">
            <div className="text-center">
              <MessageSquareIcon className="w-12 h-12 mx-auto text-primary/60 mb-4" />
              <h3 className="text-lg font-medium text-foreground">
                Selecione um canal para começar
              </h3>
              <p className="text-muted-foreground mt-1">
                Escolha uma conversa na barra lateral para começar a interagir
              </p>
            </div>
          </div>
        )}
      </div>

      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        channelType={activeFilter}
        initialData={editingChannel || undefined}
      />
    </>
  );
};

export default Chat; 