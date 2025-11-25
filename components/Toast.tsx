
import React, { useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  timestamp: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  // Deduping Logic: Show only unique messages (keep latest) + limit to 3
  const uniqueToasts = toasts.reduceRight((acc: ToastMessage[], current) => {
      if (!acc.some(t => t.message === current.message && t.type === current.type)) {
          acc.push(current);
      }
      return acc;
  }, []).slice(0, 3).reverse(); // Keep recent 3

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none items-end">
      {uniqueToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; removeToast: (id: string) => void }> = ({ toast, removeToast }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const duration = Math.max(3000, toast.message.length * 60);
    timerRef.current = setTimeout(() => {
      removeToast(toast.id);
    }, duration);

    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.message.length, removeToast]);

  const styles = {
    success: {
      icon: <CheckCircle size={20} className="text-emerald-400" />,
      border: 'border-l-emerald-500',
      bg: 'bg-[#0f172a]/95'
    },
    error: {
      icon: <AlertCircle size={20} className="text-rose-400" />,
      border: 'border-l-rose-500',
      bg: 'bg-[#0f172a]/95'
    },
    info: {
      icon: <Sparkles size={20} className="text-indigo-400" />,
      border: 'border-l-indigo-500',
      bg: 'bg-[#0f172a]/95'
    }
  };

  const style = styles[toast.type];

  return (
    <div className={`pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-sm p-4 rounded-xl glass-panel shadow-2xl border-l-4 ${style.border} ${style.bg} backdrop-blur-2xl transform transition-all duration-500 animate-enter hover:-translate-x-1 cursor-pointer border-t border-r border-b border-white/5`}>
      <div className="shrink-0">
        {style.icon}
      </div>
      <p className="flex-1 text-sm font-medium text-gray-100 leading-snug">{toast.message}</p>
      <button 
        onClick={() => removeToast(toast.id)}
        className="p-1 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
