import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({ title, description, action }: { title: string, description: string, action?: React.ReactNode }) => (
  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
    <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
