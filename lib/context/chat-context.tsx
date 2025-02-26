"use client";

import * as React from "react";
import {createClient} from "@/lib/supabase/client";
import type {Database} from "@/database.types";
import {useRouter} from "next/navigation";

type Message = Database["public"]["Tables"]["messages"]["Row"];

interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string, receiverId: string, listingId?: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const ChatContext = React.createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({children}: {children: React.ReactNode}) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const supabase = createClient();
  const router = useRouter();

  React.useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const sendMessage = React.useCallback(
    async (content: string, receiverId: string, listingId?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const {
          data: {user},
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("User not authenticated");
        }

        const {error: sendError} = await supabase.from("messages").insert({
          content,
          sender_id: user.id,
          receiver_id: receiverId,
          listing_id: listingId || null,
          read: false,
        });

        if (sendError) throw sendError;

        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to send message"));
        console.error("Error sending message:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, router]
  );

  const value = React.useMemo(
    () => ({
      messages,
      sendMessage,
      isLoading,
      error,
    }),
    [messages, sendMessage, isLoading, error]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
