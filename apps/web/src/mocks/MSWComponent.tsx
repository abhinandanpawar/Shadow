'use client';
import { useEffect } from 'react';

export function MSWComponent() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (process.env.NODE_ENV === 'development') {
        const { worker } = require('./browser');
        worker.start();
      }
    }
  }, []);

  return null;
}
