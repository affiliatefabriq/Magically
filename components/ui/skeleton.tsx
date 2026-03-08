import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

function SkeletonCard({ height }: { height: number }) {
  return (
    <div
      className="w-full rounded-xl bg-muted/40 animate-pulse"
      style={{ height }}
    />
  );
}


export { Skeleton, SkeletonCard };
