import { SelectHTMLAttributes, forwardRef } from 'react';

type SelectOption = {
  value: string;
  label: string;
};

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
};

const selectClassName =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-300';

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  function SelectInput(
    {
      label,
      error,
      hint,
      options,
      placeholder,
      id,
      className,
      ...props
    },
    ref,
  ) {
    const selectId = id ?? props.name;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
          {hint ? (
            <span className="ml-1 font-normal text-zinc-400">{hint}</span>
          ) : null}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={className ? `${selectClassName} ${className}` : selectClassName}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
      </div>
    );
  },
);
