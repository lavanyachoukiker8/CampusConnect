import React from 'react';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ children, ...props }, ref) => (
  <select ref={ref} className="w-full border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm border p-2.5 bg-white transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed" {...props}>
    {children}
  </select>
));
Select.displayName = 'Select';
