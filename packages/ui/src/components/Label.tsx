import React from 'react';
import { clsx } from 'clsx';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx('block text-sm font-medium text-gray-700', className)}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';
