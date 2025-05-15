import React, { useState, useEffect } from 'react';

// Tipos para as notificações
export type ToastVariant = 'default' | 'destructive' | 'success';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

// Função para criar e gerenciar toasts
export function toast(options: ToastOptions) {
  const event = new CustomEvent('add-toast', {
    detail: {
      ...options,
      id: Math.random().toString(36).substring(2, 9),
    },
  });
  window.dispatchEvent(event);
}

// Hook para gerenciar os toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Adicionar novo toast
  const addToast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
  };

  // Remover toast por ID
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Listener para eventos de toast
  useEffect(() => {
    const handleAddToast = (event: CustomEvent<Toast>) => {
      addToast(event.detail);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeToast(event.detail.id);
      }, 5000);
    };

    window.addEventListener('add-toast' as any, handleAddToast as EventListener);

    return () => {
      window.removeEventListener('add-toast' as any, handleAddToast as EventListener);
    };
  }, []);

  return { toasts, addToast, removeToast };
}

// Componente de Toast
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md min-w-[300px] ${
            toast.variant === 'destructive'
              ? 'bg-red-100 border-l-4 border-red-500 text-red-700'
              : toast.variant === 'success'
              ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
              : 'bg-white border-l-4 border-blue-500 text-gray-700'
          }`}
        >
          <div className="flex justify-between">
            <div className="font-medium">{toast.title}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          {toast.description && (
            <div className="text-sm mt-1">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
} 