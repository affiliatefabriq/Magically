import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const ExploreLoader = () => {
  return (
    <div className="grid-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="w-full aspect-square rounded-lg" />
      ))}
    </div>
  );
};

export const SearchLoader = () => {
  return Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="flex flex-col h-16 w-full" />);
};

export const ListLoader = () => {
  return (
    <div className="flex flex-col space-y-2 container mx-auto max-w-6xl mt-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-30" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export const ProfileLoader = () => {
  return (
    <section className="section-padding container mx-auto max-w-7xl">
      <div className="flex items-center justify-between my-6">
        <Skeleton className="h-8 w-32 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center justify-start gap-4">
          <div className="flex w-full h-full">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
        <Skeleton className="h-6 w-1/4 rounded" />
        <Skeleton className="h-6 w-2/4 rounded" />
        <Skeleton className="h-6 w-3/4 rounded" />
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex items-center justify-around">
        <div className="flex flex-col flex-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
        <div className="flex flex-col flex-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
        <div className="flex flex-col flex-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="grid-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-full aspect-square rounded-lg" />
        ))}
      </div>
    </section>
  );
};

export const UserProfileLoader = () => {
  return (
    <section className="section-padding container mx-auto max-w-7xl">
      <div className="flex items-center justify-between my-6">
        <Skeleton className="h-8 w-32 rounded" />
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center justify-start gap-4">
          <div className="flex w-full h-full">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
        <Skeleton className="h-6 w-1/4 rounded" />
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex items-center justify-around">
        <div className="flex flex-col flex-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
        <div className="flex flex-col flex-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
        <div className="flex flex-col flex-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="grid-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-full aspect-square rounded-lg" />
        ))}
      </div>
    </section>
  );
};
