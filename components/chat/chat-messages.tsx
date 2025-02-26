"use client";

import * as React from "react";
import {createClient} from "@/lib/supabase/client";
import type {Database} from "@/database.types";
import {useChat} from "@/lib/context/chat-context";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {formatDistanceToNow} from "date-fns";
import {Send, Info} from "lucide-react";
import {cn} from "@/lib/utils";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ChatMessagesProps {
  userId: string;
  otherUserId: string;
  listingId?: string;
  otherUser: Profile;
}

export function ChatMessages({userId, otherUserId, listingId, otherUser}: ChatMessagesProps) {
  const [messages, setMessages] = React.useState<Array<Message & {sender: Profile}>>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const {sendMessage, isLoading: isSending} = useChat();
  const supabase = React.useMemo(() => createClient(), []);

  const scrollToBottom = React.useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, []);

  // Auto-scroll when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load initial messages
  React.useEffect(() => {
    async function loadMessages() {
      try {
        const {data, error} = await supabase
          .from("messages")
          .select(
            `
            *,
            sender:profiles!messages_sender_id_fkey(*)
          `
          )
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
          .order("created_at", {ascending: true});

        if (error) throw error;

        setMessages(data || []);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [supabase, userId, otherUserId]);

  // Set up real-time subscription
  React.useEffect(() => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        async (payload) => {
          const newMessageData = payload.new as Message;

          // Only process messages from the other user we're chatting with
          if (newMessageData.sender_id !== otherUserId) {
            return;
          }

          const {data: senderProfile} = await supabase.from("profiles").select("*").eq("id", newMessageData.sender_id).single();

          if (senderProfile) {
            const newMessage = {
              ...newMessageData,
              sender: senderProfile,
            };

            setMessages((currentMessages) => [...currentMessages, newMessage]);
            setTimeout(scrollToBottom, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, otherUserId]);

  // Mark messages as read
  React.useEffect(() => {
    const markAsRead = async () => {
      try {
        await supabase.from("messages").update({read: true}).eq("sender_id", otherUserId).eq("receiver_id", userId).eq("read", false);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    markAsRead();
  }, [supabase, userId, otherUserId, messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      const messageContent = newMessage.trim();
      setNewMessage("");

      // Optimistically add the message to the UI
      const optimisticMessage = {
        id: Date.now().toString(),
        content: messageContent,
        sender_id: userId,
        receiver_id: otherUserId,
        created_at: new Date().toISOString(),
        read: false,
        listing_id: listingId,
        sender: {
          id: userId,
          username: "You",
          avatar_url: null,
          full_name: "You",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      } as Message & {sender: Profile};

      setMessages((currentMessages) => [...currentMessages, optimisticMessage]);
      scrollToBottom();

      // Actually send the message
      await sendMessage(messageContent, otherUserId, listingId);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((currentMessages) => currentMessages.slice(0, -1));
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Се вчитуваат пораките...</div>;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherUser.avatar_url || undefined} alt={otherUser.username} />
            <AvatarFallback>{otherUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{otherUser.full_name}</h2>
            <p className="text-sm text-muted-foreground">{otherUser.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {messages.map((message) => {
            const isSender = message.sender_id === userId;

            return (
              <div key={message.id} className={cn("flex items-start gap-3", isSender && "flex-row-reverse")}>
                <Avatar className="h-8 w-8 mt-0.5">
                  <AvatarImage src={message.sender.avatar_url || undefined} alt={message.sender.username} />
                  <AvatarFallback>{message.sender.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className={cn("flex flex-col gap-1", isSender && "items-end")}>
                  <div className={cn("rounded-2xl px-4 py-2 max-w-[85%]", isSender ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">
                    {message.created_at && formatDistanceToNow(new Date(message.created_at), {addSuffix: true})}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Chat input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напиши порака..."
            className="flex-1"
            disabled={isSending}
          />
          <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
