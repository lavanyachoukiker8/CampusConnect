import React from 'react';
import { User } from 'lucide-react';

export const Avatar = ({ src, alt, size = 'md' }: { src?: string, alt?: string, size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };
  return (
    <div className={`${sizes[size]} rounded-full bg-gray-200 overflow-hidden flex items-center justify-center`}>
      {src ? <img src={src} alt={alt || ''} className="w-full h-full object-cover" /> : <User className="text-gray-400" size={size === 'sm' ? 16 : size === 'md' ? 20 : 28} />}
    </div>
  );
};
