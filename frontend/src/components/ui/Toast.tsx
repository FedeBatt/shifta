'use client';

import { useEffect } from 'react';

type ToastProps = {
  message: string;
  variant?: 'success' | 'error';
  durationMs?: number;
  onClose: () => void;
};

const variantClasses = {
  success:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  error: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
};

export function Toast({
  message,
  variant = 'success',
  durationMs = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timeoutId);
  }, [durationMs, message, onClose]);

  return (
    <div
      role="status"
      className={`flex items-start justify-between gap-3 rounded-lg px-3 py-2 text-sm ${variantClasses[variant]}`}
    >
      <p className="min-w-0 flex-1">{message}</p>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="shrink-0 rounded p-0.5 opacity-70 transition hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
