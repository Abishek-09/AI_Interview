"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-notification toast-${toast.type} animate-slide-in`} style={{
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderLeft: `4px solid var(--${toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : toast.type === 'success' ? 'success' : 'accent-color'})`,
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '250px'
          }}>
            {toast.type === 'success' && '✅ '}
            {toast.type === 'info' && 'ℹ️ '}
            {toast.type === 'warning' && '⚠️ '}
            {toast.type === 'error' && '❌ '}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
