import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-96 w-full mt-8" />
    </div>
  );
}
