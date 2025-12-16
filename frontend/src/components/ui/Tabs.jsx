// src/components/ui/Tabs.jsx
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Tabs = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md', className)}>
      <div className={`grid grid-cols-${tabs.length}`}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative flex items-center justify-center gap-2 py-4 font-semibold transition',
              activeTab === tab.value
                ? 'text-[#00C4CC]'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Animated indicator */}
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 h-1 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] rounded-b-2xl"
        style={{
          width: `${100 / tabs.length}%`,
          left: `${(tabs.findIndex(t => t.value === activeTab) * 100) / tabs.length}%`,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </div>
  );
};

export default Tabs;
