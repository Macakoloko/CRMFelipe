import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ChannelType = 'clients' | 'projects' | 'groups' | 'direct';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  avatar?: string;
  unreadCount: number;
  lastMessage?: string;
  participants: string[];
  isMuted: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  channelId: string;
  content: string;
  timestamp: Date;
  attachments?: { name: string; url: string; type: string }[];
  reactions?: { emoji: string; users: string[] }[];
}

interface ChatContextType {
  messages: Message[];
  channels: Channel[];
  currentChannel: Channel | null;
  currentUser: string | null;
  isConnected: boolean;
  setCurrentUser: (userId: string) => void;
  setCurrentChannel: (channel: Channel) => void;
  sendMessage: (content: string, attachments?: { name: string; url: string; type: string }[]) => void;
  addReaction: (messageId: string, emoji: string) => void;
  toggleMuteChannel: (channelId: string) => void;
  createChannel: (channelData: Omit<Channel, 'id'>) => Promise<void>;
  updateChannel: (channelId: string, channelData: Partial<Channel>) => Promise<void>;
  deleteChannel: (channelId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Sample initial channels
const initialChannels: Channel[] = [
  {
    id: 'client-1',
    name: 'Marca X',
    type: 'clients',
    unreadCount: 0,
    participants: [],
    isMuted: false,
    avatar: '/client-avatar.png',
    lastMessage: 'Último briefing atualizado'
  },
  {
    id: 'project-1',
    name: 'Campanha Verão',
    type: 'projects',
    unreadCount: 0,
    participants: [],
    isMuted: false,
    lastMessage: 'Cronograma atualizado'
  },
  {
    id: 'group-1',
    name: 'Time de Design',
    type: 'groups',
    unreadCount: 0,
    participants: [],
    isMuted: false,
    lastMessage: 'Nova paleta de cores'
  },
  {
    id: 'direct-1',
    name: 'João Silva',
    type: 'direct',
    unreadCount: 0,
    participants: [],
    isMuted: false,
    avatar: 'https://ui.shadcn.com/avatars/01.png',
    lastMessage: 'Vamos revisar o layout?'
  }
];

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      if (reconnectAttempt >= maxReconnectAttempts) {
        console.error('Máximo de tentativas de reconexão atingido');
        return;
      }

      try {
        ws = new WebSocket('ws://localhost:8080/chat');

        ws.onopen = () => {
          console.log('Conectado ao servidor de chat');
          setIsConnected(true);
          setSocket(ws);
          setReconnectAttempt(0); // Reset reconnect attempts on successful connection
          
          // Send authentication if needed
          if (currentUser) {
            ws.send(JSON.stringify({ type: 'auth', userId: currentUser }));
          }
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'error') {
              console.error('Erro do servidor:', message.error);
              return;
            }
            
            setMessages((prev) => [...prev, message]);
            setChannels((prev) => 
              prev.map((channel) => {
                if (channel.id === message.channelId) {
                  return {
                    ...channel,
                    lastMessage: message.content,
                    unreadCount: currentChannel?.id !== channel.id ? 
                      channel.unreadCount + 1 : 0
                  };
                }
                return channel;
              })
            );
          } catch (error) {
            console.error('Erro ao processar mensagem:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('Erro WebSocket:', error);
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          console.log(`Desconectado do servidor de chat. Código: ${event.code}, Razão: ${event.reason}`);
          setIsConnected(false);
          setSocket(null);

          // Attempt to reconnect with exponential backoff
          const nextDelay = Math.min(reconnectDelay * Math.pow(2, reconnectAttempt), 30000);
          console.log(`Tentando reconectar em ${nextDelay/1000} segundos...`);
          
          reconnectTimeout = setTimeout(() => {
            setReconnectAttempt(prev => prev + 1);
            connectWebSocket();
          }, nextDelay);
        };
      } catch (error) {
        console.error('Erro ao criar conexão WebSocket:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [currentUser, reconnectAttempt]); // Add dependencies

  const sendMessage = (content: string, attachments?: { name: string; url: string; type: string }[]) => {
    if (!socket || !currentUser || !currentChannel || !isConnected) {
      console.error('Cannot send message: ', {
        socketConnected: !!socket && isConnected,
        userLoggedIn: !!currentUser,
        channelSelected: !!currentChannel
      });
      return;
    }

    const message: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: currentUser,
      channelId: currentChannel.id,
      content,
      timestamp: new Date(),
      attachments
    };

    try {
      socket.send(JSON.stringify(message));
      
      // Optimistically add the message to the state
      setMessages(prev => [...prev, message]);
      setChannels(prev =>
        prev.map(channel => {
          if (channel.id === currentChannel.id) {
            return {
              ...channel,
              lastMessage: content
            };
          }
          return channel;
        })
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === messageId) {
          const reactions = message.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);

          if (existingReaction && currentUser) {
            if (existingReaction.users.includes(currentUser)) {
              existingReaction.users = existingReaction.users.filter((u) => u !== currentUser);
            } else {
              existingReaction.users.push(currentUser);
            }
          } else if (currentUser) {
            reactions.push({ emoji, users: [currentUser] });
          }

          return { ...message, reactions };
        }
        return message;
      })
    );
  };

  const toggleMuteChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((channel) => {
        if (channel.id === channelId) {
          return { ...channel, isMuted: !channel.isMuted };
        }
        return channel;
      })
    );
  };

  const createChannel = async (channelData: Omit<Channel, 'id'>) => {
    const newChannel: Channel = {
      ...channelData,
      id: Math.random().toString(36).substring(2, 9),
      lastMessage: undefined
    };

    setChannels(prev => [...prev, newChannel]);

    // In a real app, you would make an API call here
    // await api.post('/channels', channelData);
  };

  const updateChannel = async (channelId: string, channelData: Partial<Channel>) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === channelId
          ? { ...channel, ...channelData }
          : channel
      )
    );

    // In a real app, you would make an API call here
    // await api.put(`/channels/${channelId}`, channelData);
  };

  const deleteChannel = async (channelId: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== channelId));
    if (currentChannel?.id === channelId) {
      setCurrentChannel(null);
    }

    // In a real app, you would make an API call here
    // await api.delete(`/channels/${channelId}`);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        channels,
        currentChannel,
        currentUser,
        isConnected,
        setCurrentUser,
        setCurrentChannel,
        sendMessage,
        addReaction,
        toggleMuteChannel,
        createChannel,
        updateChannel,
        deleteChannel
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 