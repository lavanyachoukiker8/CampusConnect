import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const FormField = ({ label, error, icon, children }: FormFieldProps) => {
  const id = React.useId();
  
  const child = React.isValidElement(children) 
    ? React.cloneElement(children as React.ReactElement<any>, { id }) 
    : children;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {icon && <span className="inline-flex items-center gap-1">{icon} {label}</span>}
        {!icon && label}
      </label>
      {child}
      {error && <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>{error}</p>}
    </div>
  );
};
