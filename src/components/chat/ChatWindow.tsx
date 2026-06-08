"use client";

import * as React from "react";
import { X, Send } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { getSocket } from "@/lib/socket";
import { Message } from "@/types";
import api from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export function ChatWindow() {
  const currentUser = useAuthStore((state) => state.user);
  const { activeChatFriend, setActiveChat } = useChatStore();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!activeChatFriend) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get<Message[]>(
          `/messages/${activeChatFriend.id}`
        );
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    const socket = getSocket();
    if (socket) {
      socket.emit("markSeen", { senderId: activeChatFriend.id });
    }
  }, [activeChatFriend]);

  React.useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeChatFriend) return;

    const handleNewMessage = (message: Message) => {
      if (
        message.sender.id === activeChatFriend.id ||
        message.receiver.id === activeChatFriend.id
      ) {
        setMessages((prev) => [...prev, message]);
        if (message.sender.id === activeChatFriend.id) {
          socket.emit("markSeen", { senderId: activeChatFriend.id });
        }
      }
    };

    const handleMessageSent = (message: Message) => {
      if (message.receiver.id === activeChatFriend.id) {
        // Find optimistic message and update, or just append
        // To keep it simple, we just append since we don't have optimistic IDs
        // wait, the prompt says "confirmation sender's message was saved".
        // Let's replace the last optimistic message or just append it.
        // Actually, better to append when `messageSent` is received if we don't append optimistically.
        // Or we can add optimistically and then update ID. Let's just append when received.
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleMessageDelivered = ({ messageId }: { messageId: number }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, delivered: true } : m))
      );
    };

    const handleMessagesSeen = ({ by }: { by: number }) => {
      if (by === activeChatFriend.id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.receiver.id === activeChatFriend.id ? { ...m, seen: true } : m
          )
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSent", handleMessageSent);
    socket.on("messageDelivered", handleMessageDelivered);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSent", handleMessageSent);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [activeChatFriend]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChatFriend) return;

    const socket = getSocket();
    if (socket) {
      socket.emit("sendMessage", {
        receiverId: activeChatFriend.id,
        content: inputValue.trim(),
      });
      setInputValue("");
    }
  };

  if (!activeChatFriend) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 rounded-lg shadow-2xl border border-border bg-white flex flex-col overflow-hidden h-[500px] max-h-[80vh]">
      <div className="flex items-center justify-between p-3 border-b border-border bg-mist/30">
        <div className="flex items-center gap-3">
          <Avatar
            src={activeChatFriend.profilePic}
            alt={activeChatFriend.name || "User"}
            size="sm"
          />
          <div>
            <div className="font-bold text-sm">
              {activeChatFriend.name || "Anonymous"}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 px-0"
          onClick={() => setActiveChat(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender.id === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  isMe ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-[#F5F5F5] text-black rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {isMe && (
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {msg.seen
                      ? "Seen"
                      : msg.delivered
                      ? "Delivered"
                      : "Sent"}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 border-t border-border flex items-center gap-2 bg-white"
      >
        <Input
          label="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm" className="px-3" disabled={!inputValue.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
