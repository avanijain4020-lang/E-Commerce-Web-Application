import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertTriangle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const bgStyles = {
    success: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30 text-green-800 dark:text-green-300',
    error: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30 text-red-800 dark:text-red-300',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30 text-blue-800 dark:text-blue-300'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-premium border shadow-premium glass backdrop-blur-md animate-in slide-in-from-bottom duration-300 ${bgStyles[type]}`}>
      {icons[type]}
      <span className="text-sm font-semibold tracking-wide pr-2">{message}</span>
      <button 
        onClick={onClose}
        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="h-4 w-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
