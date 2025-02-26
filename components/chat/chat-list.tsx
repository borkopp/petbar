"use client";

import * as React from "react";
import {createClient} from "@/lib/supabase/client";
import type {Database} from "@/database.types";
import {useRouter, usePathname} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {formatDistanceToNow} from "date-fns";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ChatListProps {
  userId: string;
}

export function ChatList({userId}: ChatListProps) {
  const [conversations, setConversations] = React.useState<Array<{message: Message; profile: Profile}>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  React.useEffect(() => {
    async function loadConversations() {
      try {
        // Get the latest message from each conversation
        const {data: messages, error: messagesError} = await supabase
          .from("messages")
          .select(
            `
            *,
            sender:profiles!messages_sender_id_fkey(*),
            receiver:profiles!messages_receiver_id_fkey(*)
          `
          )
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order("created_at", {ascending: false});

        if (messagesError) throw messagesError;

        // Group by conversation and get the latest message
        const conversationMap = new Map();
        messages?.forEach((message) => {
          const otherUser = message.sender_id === userId ? message.receiver : message.sender;
          if (!conversationMap.has(otherUser.id)) {
            conversationMap.set(otherUser.id, {
              message,
              profile: otherUser,
            });
          }
        });

        setConversations(Array.from(conversationMap.values()));
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel("chat_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `or(sender_id=eq.${userId},receiver_id=eq.${userId})`,
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Се вчитуваат разговорите...</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {conversations.map(({message, profile}) => {
          const isActive = pathname === `/chat/${profile.id}`;
          const isUnread = !message.read && message.receiver_id === userId;

          return (
            <button
              key={profile.id}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                isActive && "bg-accent",
                "relative"
              )}
              onClick={() => router.push(`/chat/${profile.id}`)}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ""} />
                <AvatarFallback>{profile.full_name?.slice(0, 2).toUpperCase() || ""}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className={cn("font-medium", isUnread && "font-semibold")}>{profile.full_name}</p>
                  <span className="text-xs text-muted-foreground">
                    {message.created_at && formatDistanceToNow(new Date(message.created_at), {addSuffix: true})}
                  </span>
                </div>
                <p className={cn("text-sm text-muted-foreground truncate", isUnread && "text-foreground font-medium")}>{message.content}</p>
              </div>
              {isUnread && <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary"></div>}
            </button>
          );
        })}
        {conversations.length === 0 && <div className="text-center text-sm text-muted-foreground p-4">Сѐ уште нема разговори</div>}
      </div>
    </ScrollArea>
  );
}
