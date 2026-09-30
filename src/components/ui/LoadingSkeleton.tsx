import React from 'react';

export const LoadingSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="animate-pulse space-y-4">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
    ))}
  </div>
);
