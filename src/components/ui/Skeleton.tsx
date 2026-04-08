import { motion } from 'framer-motion';

export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gray-100 animate-pulse rounded-lg ${className}`} />
  );
}

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
