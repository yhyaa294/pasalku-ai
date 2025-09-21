import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-16 w-[200px] rounded-lg" />
      </div>
      <div className="flex items-start space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-24 w-[250px] rounded-lg" />
      </div>
    </div>
  );
}
