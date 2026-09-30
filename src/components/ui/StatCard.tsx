import React from 'react';

export const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon?: React.ReactNode }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5 flex items-center">
      {icon && <div className="flex-shrink-0 mr-4 text-primary-500">{icon}</div>}
      <div>
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
      </div>
    </div>
  </div>
);
