// src/components/ui/Button.jsx
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isLoading,
  disabled,
  'aria-label': ariaLabel,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-[#00E5A0] dark:hover:border-[#00E5A0]',
    outline: 'border-2 border-[#00E5A0] text-[#00E5A0] hover:bg-[#00E5A0] hover:text-white',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      aria-label={isLoading ? `Loading... ${ariaLabel || ''}` : ariaLabel}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div 
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            role="status"
            aria-hidden="true"
          />
          <span className="sr-only">Loading...</span>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
