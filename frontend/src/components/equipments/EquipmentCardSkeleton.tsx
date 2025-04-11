import { Skeleton } from "@/components/ui/skeleton";

export function EquipmentCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="h-48 relative">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-1/4 rounded-md" />
        </div>
      </div>
    </div>
  );
} 