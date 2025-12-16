// src/components/ui/Input.jsx
import { cn } from '../../utils/cn';

const Input = ({ label, error, className, id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3',
          'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'outline-none ring-0 transition-all duration-200',
          'focus:border-transparent focus:shadow-[0_0_0_3px_rgba(0,229,160,0.35)]',
          error && 'border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.35)]',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
