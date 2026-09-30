import React from 'react';

export const PageHeader = ({ title, description, action }: { title: string, description?: string, action?: React.ReactNode }) => (
  <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{title}</h1>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
    {action && <div className="mt-4 sm:mt-0 flex">{action}</div>}
  </div>
);
