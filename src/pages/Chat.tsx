import React, { useEffect } from 'react';
import Chat from '../components/Chat';
import { useChat } from '../lib/ChatContext';
import { useNotifications } from '../lib/NotificationsContext';

const ChatPage: React.FC = () => {
  const { setCurrentUser } = useChat();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // For demo purposes, set a random user ID
    const userId = `user-${Math.random().toString(36).substring(2, 9)}`;
    setCurrentUser(userId);
    
    addNotification({
      message: 'Connected to chat successfully',
      type: 'success',
      duration: 3000,
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Chat</h1>
      <Chat />
    </div>
  );
};

export default ChatPage;
