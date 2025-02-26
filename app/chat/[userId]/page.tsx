import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {ChatMessages} from "@/components/chat/chat-messages";
import {ChatProvider} from "@/lib/context/chat-context";

interface ChatPageProps {
  params: {
    userId: string;
  };
  searchParams: {
    listing?: string;
  };
}

export default async function ChatPage({params, searchParams}: ChatPageProps) {
  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get other user's profile
  const {data: otherUser, error: otherUserError} = await supabase.from("profiles").select("*").eq("id", params.userId).single();

  if (otherUserError || !otherUser) {
    redirect("/chat");
  }

  return (
    <ChatProvider>
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <ChatMessages userId={user.id} otherUserId={params.userId} listingId={searchParams.listing} otherUser={otherUser} />
      </div>
    </ChatProvider>
  );
}
