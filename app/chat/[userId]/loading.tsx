import {Skeleton} from "@/components/ui/skeleton";

export default function ChatConversationLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Chat Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block md:w-80 border-r border-border">
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

      {/* Chat Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <div className="border-b p-4 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Received Messages */}
          {Array.from({length: 3}).map((_, i) => (
            <div key={`received-${i}`} className="flex items-end gap-2 max-w-[80%]">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="space-y-1">
                <div className="bg-accent rounded-2xl rounded-bl-none p-3">
                  <Skeleton className="h-4 w-[180px] md:w-[250px]" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}

          {/* Sent Messages */}
          {Array.from({length: 3}).map((_, i) => (
            <div key={`sent-${i}`} className="flex items-end gap-2 max-w-[80%] ml-auto flex-row-reverse">
              <div className="space-y-1">
                <div className="bg-primary rounded-2xl rounded-br-none p-3">
                  <Skeleton className="h-4 w-[150px] md:w-[220px]" />
                </div>
                <Skeleton className="h-3 w-16 ml-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
