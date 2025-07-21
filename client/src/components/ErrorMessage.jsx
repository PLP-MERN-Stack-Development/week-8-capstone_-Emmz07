import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800 font-medium">Error</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-red-700 mt-1">{message}</p>
    </div>
  );
};

export default ErrorMessage;