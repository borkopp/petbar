import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {ChatList} from "@/components/chat/chat-list";
import {ChatProvider} from "@/lib/context/chat-context";

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ChatProvider>
      <div className="container mx-auto max-w-4xl py-8">
        <ChatList userId={user.id} />
      </div>
    </ChatProvider>
  );
}
