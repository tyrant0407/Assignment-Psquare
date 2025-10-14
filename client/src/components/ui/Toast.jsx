import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                if (onClose) onClose();
            }, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300);
    };

    const getToastStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform";

        if (!isVisible) {
            return `${baseStyles} opacity-0 translate-x-full`;
        }

        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
            case 'error':
                return `${baseStyles} bg-red-50 border border-red-200 text-red-800`;
            case 'warning':
                return `${baseStyles} bg-yellow-50 border border-yellow-200 text-yellow-800`;
            case 'info':
                return `${baseStyles} bg-blue-50 border border-blue-200 text-blue-800`;
            default:
                return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '✅';
        }
    };

    return (
        <div className={getToastStyles()}>
            <div className="flex items-center gap-3">
                <span className="text-xl">{getIcon()}</span>
                <div className="flex-1">
                    <p className="font-medium text-sm">{message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold ml-2"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

// Toast container component
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast;