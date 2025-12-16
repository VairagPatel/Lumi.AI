// src/components/ui/Skeleton.jsx
import { cn } from '../../utils/cn';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}
    />
  );
};

export const SkeletonCard = () => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 space-y-4">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-4 w-full" style={{ width: `${100 - i * 10}%` }} />
    ))}
  </div>
);

export default Skeleton;
