import React from 'react';
import { clsx } from 'clsx';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, isOpen, onClose, children, ...props }, ref) => {
    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={clsx(
          'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50',
          className
        )}
        onClick={onClose}
        {...props}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
