import {Skeleton} from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Chat Sidebar */}
      <div className="w-full md:w-80 border-r border-border">
        {/* Search Bar */}
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Conversation List */}
        <div className="overflow-auto h-[calc(100vh-8rem)]">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 border-b hover:bg-accent/50">
              <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-4 w-full mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty Chat State */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Skeleton className="h-16 w-16 rounded-full mb-4" />
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-5 w-64 mb-6" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
