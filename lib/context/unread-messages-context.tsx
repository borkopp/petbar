"use client";

import * as React from "react";
import {createClient} from "@/lib/supabase/client";
import {toast} from "sonner";

interface UnreadMessagesContextType {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  updateUnreadCount: () => Promise<void>;
}

const UnreadMessagesContext = React.createContext<UnreadMessagesContextType | undefined>(undefined);

export function UnreadMessagesProvider({children, userId}: {children: React.ReactNode; userId?: string}) {
  const [unreadCount, setUnreadCount] = React.useState(0);
  const supabase = React.useMemo(() => createClient(), []);

  const updateUnreadCount = React.useCallback(async () => {
    if (!userId) return;

    const {count} = await supabase.from("messages").select("*", {count: "exact", head: true}).eq("receiver_id", userId).eq("read", false);

    setUnreadCount(count || 0);
  }, [supabase, userId]);

  // Initial load of unread count
  React.useEffect(() => {
    if (userId) {
      updateUnreadCount();
    }
  }, [userId, updateUnreadCount]);

  // Subscribe to new messages
  React.useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("unread_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        async (payload) => {
          // Get sender's profile
          const {data: sender} = await supabase.from("profiles").select("*").eq("id", payload.new.sender_id).single();

          // Show toast notification
          toast.info(`Нова порака од ${sender?.full_name || "некој"}`, {
            description: payload.new.content,
          });

          // Update unread count
          updateUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, updateUnreadCount]);

  const value = React.useMemo(
    () => ({
      unreadCount,
      setUnreadCount,
      updateUnreadCount,
    }),
    [unreadCount, updateUnreadCount]
  );

  return <UnreadMessagesContext.Provider value={value}>{children}</UnreadMessagesContext.Provider>;
}

export function useUnreadMessages() {
  const context = React.useContext(UnreadMessagesContext);
  if (context === undefined) {
    throw new Error("useUnreadMessages must be used within a UnreadMessagesProvider");
  }
  return context;
}
