import { useEffect } from 'react';
import { useUIStore } from '../context/store.js';
import toast, { Toaster } from 'react-hot-toast';

export default function ToastProvider({ children }) {
  const { notifications, removeNotification } = useUIStore();

  useEffect(() => {
    notifications.forEach((notification) => {
      const { id, type, message, duration = 3000 } = notification;

      toast[type](message, { duration });

      const timer = setTimeout(() => {
        removeNotification(id);
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FDFBF7',
            color: '#3E3937',
            border: '1px solid #E5D7C8',
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </>
  );
}
