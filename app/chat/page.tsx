import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {MessageSquare} from "lucide-react";
import {ChatList} from "@/components/chat/chat-list";

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {/* Mobile: Show chat list */}
      <div className="md:hidden h-full">
        <ChatList userId={user.id} />
      </div>

      {/* Desktop: Show welcome message */}
      <div className="hidden md:flex h-full flex-col items-center justify-center text-center p-8 space-y-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Добредојдовте во разговорите</h1>
          <p className="text-muted-foreground">Изберете разговор од листата или започнете нов разговор</p>
        </div>
      </div>
    </>
  );
}
