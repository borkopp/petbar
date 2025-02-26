import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {ChatProvider} from "@/lib/context/chat-context";
import {ChatList} from "@/components/chat/chat-list";
import {Separator} from "@/components/ui/separator";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";

export default async function ChatLayout({children}: {children: React.ReactNode}) {
  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ChatProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop: Left sidebar - Chat list */}
        <div className="hidden md:block w-80 border-r">
          <div className="flex h-full flex-col">
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Пребарај разговори..." className="pl-8" />
              </div>
              <Separator />
            </div>
            <div className="flex-1">
              <ChatList userId={user.id} />
            </div>
          </div>
        </div>

        {/* Right side - Chat messages */}
        <div className="flex-1">{children}</div>
      </div>
    </ChatProvider>
  );
}
