import React from "react";
import { useEffect} from "react";

interface ToastProps {
    message: string;
    onClose: () => void;
    type?: 'success' | 'error' | 'info'; // Тип уведомления
  }
  
  const Toast: React.FC<ToastProps> = ({ message, onClose, type = 'info' }) => {

    const getBackgroundColor = () => {
      switch (type) {
        case 'success':
          return 'bg-green-500';
        case 'error':
          return 'bg-red-500';
        case 'info':
        default:
          return 'bg-blue-500';
      }
    };


    useEffect(() => {
      const timer = window.setTimeout(() => {
        onClose();
      }, 5000);

      return () => window.clearTimeout(timer);
    }, [onClose]);
    
    return (
      <div
        className={`fixed top-4 right-4 p-4 rounded-md shadow-md text-white ${getBackgroundColor()} transition-opacity duration-300`}
      >
        <div>{message}</div>
        <button onClick={onClose} className="mt-2 text-sm underline">
          Close
        </button>
      </div>
    );
  };
  
  export default Toast;