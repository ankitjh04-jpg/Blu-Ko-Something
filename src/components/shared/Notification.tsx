import { useEffect } from 'react';
import { CheckCircle, XCircle, X, Info } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} className="flex-shrink-0" />;
      case 'error':
        return <XCircle size={24} className="flex-shrink-0" />;
      case 'info':
        return <Info size={24} className="flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl min-w-[300px] max-w-[500px] ${getStyles()}`}
      >
        {getIcon()}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
