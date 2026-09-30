import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "We couldn't load the requested data. Please try again.",
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-100 rounded-xl max-w-md mx-auto my-8">
    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <AlertTriangle className="text-red-600" size={24} aria-hidden="true" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-6">{description}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="secondary" className="flex items-center gap-2">
        <RefreshCcw size={16} aria-hidden="true" /> Try Again
      </Button>
    )}
  </div>
);
