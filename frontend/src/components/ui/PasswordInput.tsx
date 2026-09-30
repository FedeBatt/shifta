'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

const inputClassName =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 pr-11 text-sm text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-300';

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      label,
      error,
      hint,
      id,
      className,
      autoComplete = 'new-password',
      onBlur,
      ...props
    },
    ref,
  ) {
    const [showPassword, setShowPassword] = useState(true);
    const inputId = id ?? props.name;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
          {hint ? (
            <span className="ml-1 font-normal text-zinc-400">{hint}</span>
          ) : null}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            autoComplete={autoComplete}
            className={
              className ? `${inputClassName} ${className}` : inputClassName
            }
            aria-invalid={Boolean(error)}
            onBlur={(event) => {
              setShowPassword(false);
              onBlur?.(event);
            }}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label={
              showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.2 4.4" />
                <path d="M6.1 6.1A17.5 17.5 0 0 0 2 12s3.5 7 10 7a10.3 10.3 0 0 0 4.4-1" />
              </svg>
            )}
          </button>
        </div>
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
      </div>
    );
  },
);
