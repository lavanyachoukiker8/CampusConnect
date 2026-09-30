import React from 'react';

type BadgeStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'confirmed' | 'open' | 'full' | 'completed' | 'default';

export const Badge = ({ status = 'default', children }: { status?: BadgeStatus, children: React.ReactNode }) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    confirmed: 'bg-green-100 text-green-800',
    open: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800',
    full: 'bg-gray-100 text-gray-800',
    completed: 'bg-indigo-100 text-indigo-800',
    default: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {children}
    </span>
  );
};
