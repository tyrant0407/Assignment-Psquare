import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = ++toastId;
        const newToast = {
            id,
            message,
            type,
            duration
        };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id);
        }, duration + 300); // Add extra time for animation

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    const error = useCallback((message, duration) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    const warning = useCallback((message, duration) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    const info = useCallback((message, duration) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        clearAll
    };
};

export default useToast;