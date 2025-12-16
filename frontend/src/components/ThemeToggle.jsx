// src/components/ThemeToggle.jsx
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import useThemeStore from '../store/useThemeStore';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon size={20} className="text-blue-400" />
        ) : (
          <Sun size={20} className="text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
