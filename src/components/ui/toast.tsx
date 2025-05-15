import React from 'react';
import { useToast, ToastVariant } from './use-toast';

export function Toast() {
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

export default Toast;
