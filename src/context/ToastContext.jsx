import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const showSuccess = useCallback((message, title = 'Success') => {
    return addToast({ title, message, type: 'success' });
  }, [addToast]);

  const showError = useCallback((message, title = 'Error') => {
    return addToast({ title, message, type: 'error', duration: 5000 });
  }, [addToast]);

  const showInfo = useCallback((message, title = 'Notice') => {
    return addToast({ title, message, type: 'info' });
  }, [addToast]);

  const showWarning = useCallback((message, title = 'Warning') => {
    return addToast({ title, message, type: 'warning', duration: 4500 });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showInfo, showWarning, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
