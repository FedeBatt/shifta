import { InputHTMLAttributes, forwardRef } from 'react';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

const inputClassName =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-300';

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    { label, error, hint, id, className, autoComplete = 'off', ...props },
    ref,
  ) {
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
        <input
          ref={ref}
          id={inputId}
          autoComplete={autoComplete}
          className={className ? `${inputClassName} ${className}` : inputClassName}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
      </div>
    );
  },
);
