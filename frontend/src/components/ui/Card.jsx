// src/components/ui/Card.jsx
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({ children, className, hover = true, ...props }) => {
  const Component = hover ? motion.div : 'div';
  
  return (
    <Component
      {...(hover && {
        whileHover: { y: -4, scale: 1.01 },
        transition: { duration: 0.2 }
      })}
      className={cn(
        'rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm',
        hover && 'hover:shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
