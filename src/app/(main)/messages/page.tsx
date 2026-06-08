"use client";

import * as React from "react";
import Link from "next/link";
import { useFriends } from "@/hooks/useFriends";
import { useChatStore } from "@/store/chat.store";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Friendship, User } from "@/types";
import { useAuthStore } from "@/store/auth.store";

function UserCard({ user, action }: { user: User; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-paper hover:bg-mist/50 transition-colors">
      <Link href={`/profile/${user.id}`} className="flex items-center gap-3">
        <Avatar src={user.profilePic} alt={user.name || "User"} />
        <div>
          <div className="font-bold hover:underline">
            {user.name || "Anonymous"}
          </div>
          <div className="text-sm text-muted-foreground">@{user.id}</div>
        </div>
      </Link>
      {action && <div>{action}</div>}
    </div>
  );
}

export default function MessagesPage() {
  const currentUser = useAuthStore((state) => state.user);
  const { setActiveChat } = useChatStore();
  const { data: friendships, isLoading } = useFriends();

  const acceptedFriends = React.useMemo(
    () =>
      friendships?.filter(
        (friendship: Friendship) => friendship.status === "accepted",
      ) ?? [],
    [friendships],
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold font-serif">Messages</h1>
      </header>

      <div className="flex-1 p-4">
        <h2 className="font-bold text-lg mb-4 text-muted-foreground">Select a friend to message</h2>
        
        {isLoading ? (
          <div className="py-4 flex justify-center">
            <Spinner />
          </div>
        ) : acceptedFriends.length === 0 ? (
          <div className="text-center py-10 border border-border rounded-lg bg-mist/30">
            <p className="text-muted-foreground">
              You need to add friends before you can message them.
            </p>
            <Link href="/users">
              <Button className="mt-4" variant="outline">Explore Users</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col border border-border rounded-lg overflow-hidden">
            {acceptedFriends.map((friendship: Friendship) => {
              const friend =
                friendship.sender.id === currentUser?.id
                  ? friendship.receiver
                  : friendship.sender;
              return (
                <UserCard
                  key={friendship.id}
                  user={friend}
                  action={
                    <Button
                      size="sm"
                      onClick={() => setActiveChat(friend)}
                    >
                      Open Chat
                    </Button>
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
