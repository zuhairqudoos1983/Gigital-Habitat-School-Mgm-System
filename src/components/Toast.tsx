import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div id="toast-container" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastType; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500" />,
    info: <Info className="h-5 w-5 text-indigo-500" />,
  };

  const borderColors = {
    success: 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/20',
    error: 'border-rose-500/20 bg-rose-50/90 dark:bg-rose-950/20',
    info: 'border-indigo-500/20 bg-indigo-50/90 dark:bg-indigo-950/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      layout
      id={`toast-${toast.id}`}
      className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-lg ${borderColors[toast.type]} text-gray-800 dark:text-gray-100 font-sans`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        id={`toast-close-${toast.id}`}
        className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};
