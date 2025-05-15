import React from 'react';
import { useNotifications } from '../lib/NotificationsContext';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-lg p-4 shadow-lg max-w-sm relative ${
              notification.type === 'success'
                ? 'bg-green-100 text-green-800'
                : notification.type === 'error'
                ? 'bg-red-100 text-red-800'
                : notification.type === 'warning'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            <button
              onClick={() => removeNotification(notification.id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <XIcon size={16} />
            </button>
            <p className="text-sm">{notification.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notifications; 