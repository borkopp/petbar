import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {ChatMessages} from "@/components/chat/chat-messages";
import {ChatProvider} from "@/lib/context/chat-context";

interface ChatPageProps {
  params: Promise<{
    userId: string;
  }>;
  searchParams: Promise<{
    listing?: string;
  }>;
}

export default async function ChatPage({params, searchParams}: ChatPageProps) {
  const {userId} = await params;
  const {listing} = await searchParams;

  const supabase = await createClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get other user's profile
  const {data: otherUser, error: otherUserError} = await supabase.from("profiles").select("*").eq("id", userId).single();

  if (otherUserError || !otherUser) {
    redirect("/chat");
  }

  return (
    <ChatProvider>
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <ChatMessages userId={user.id} otherUserId={userId} listingId={listing} otherUser={otherUser} />
      </div>
    </ChatProvider>
  );
}
