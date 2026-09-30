import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 24 }: { size?: number }) => (
  <Loader2 className="animate-spin text-primary-600" size={size} />
);
