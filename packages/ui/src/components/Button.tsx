import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const baseStyles = 'px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary-hover',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';