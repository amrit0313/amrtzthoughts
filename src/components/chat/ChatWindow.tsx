"use client";

import * as React from "react";
import { X, Send, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { getSocket } from "@/lib/socket";
import { Message } from "@/types";
import api from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

const URL_REGEX = /https?:\/\/[^\s]+/g;

function MessageContent({ content, isMe }: { content: string; isMe: boolean }) {
  const parts = content.split(URL_REGEX);
  const urls = content.match(URL_REGEX) ?? [];

  if (urls.length === 0) return <span>{content}</span>;

  return (
    <span>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {urls[i] && (
            <a
              href={urls[i]}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-0.5 underline underline-offset-2 break-all ${
                isMe ? "text-blue-200 hover:text-white" : "text-blue-600 hover:text-blue-800"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {urls[i]}
              <ExternalLink className="inline h-3 w-3 flex-shrink-0" />
            </a>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}

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
      // Only handle messages from the friend (not our own — those are handled by messageSent)
      if (message.sender.id === activeChatFriend.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        socket.emit("markSeen", { senderId: activeChatFriend.id });
      }
    };

    const handleMessageSent = (message: Message) => {
      // This fires for OUR sent messages — replace optimistic or add if missing
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;

        // Replace optimistic placeholder (matched by content and temp id)
        const optimisticIndex = prev.findIndex(
          (m) => m.content === message.content && m.id > 1_000_000_000_000
        );
        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = message;
          return updated;
        }

        return [...prev, message];
      });
    };

    const handleMessageDelivered = (payload: Record<string, unknown>) => {
      // Backend may send { messageId } or { id } — handle both
      const messageId = (payload.messageId ?? payload.id) as number | string;
      console.log("[socket] messageDelivered payload:", payload);
      setMessages((prev) =>
        // eslint-disable-next-line eqeqeq
        prev.map((m) => (m.id == messageId ? { ...m, delivered: true } : m))
      );
    };

    const handleMessagesSeen = (payload: Record<string, unknown>) => {
      // Backend may send { by } as the reader's userId
      const by = payload.by as number | string;
      console.log("[socket] messagesSeen payload:", payload);
      // eslint-disable-next-line eqeqeq
      if (by == activeChatFriend.id) {
        // Mark all messages WE sent to this friend as seen
        setMessages((prev) =>
          prev.map((m) =>
            // eslint-disable-next-line eqeqeq
            m.sender.id == currentUser?.id && m.receiver.id == activeChatFriend.id
              ? { ...m, seen: true }
              : m
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
  }, [activeChatFriend, currentUser]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChatFriend || !currentUser) return;

    const content = inputValue.trim();
    setInputValue("");

    const socket = getSocket();
    if (socket) {
      socket.emit("sendMessage", {
        receiverId: activeChatFriend.id,
        content: content,
      });
    }

    // Optimistic UI: add immediately so sender sees their own message right away
    const tempId = Date.now();
    const optimisticMsg: Message = {
      id: tempId,
      sender: currentUser,
      receiver: activeChatFriend,
      content,
      delivered: false,
      seen: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
  };

  if (!activeChatFriend) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white sm:inset-auto sm:bottom-4 sm:right-4 sm:w-96 sm:rounded-lg sm:shadow-2xl sm:border sm:border-border sm:h-[500px] sm:max-h-[80vh]">
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
                  <MessageContent content={msg.content} isMe={isMe} />
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
