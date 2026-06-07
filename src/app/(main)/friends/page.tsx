"use client";

import * as React from "react";
import Link from "next/link";
import {
  useFriends,
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useUnfriend,
} from "@/hooks/useFriends";
import { useAuthStore } from "@/store/auth.store";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Friendship, User } from "@/types";

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

export default function FriendsPage() {
  const currentUser = useAuthStore((state) => state.user);
  const { data: friendships, isLoading: isFriendsLoading } = useFriends();
  console.log(friendships);

  const { mutate: acceptRequest } = useAcceptFriendRequest();
  const { mutate: cancelRequest } = useCancelFriendRequest();
  const { mutate: unfriend } = useUnfriend();

  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const pendingRequests = React.useMemo(
    () =>
      friendships?.filter(
        (friendship: Friendship) => friendship.status === "pending",
      ) ?? [],
    [friendships],
  );

  const acceptedFriends = React.useMemo(
    () =>
      friendships?.filter(
        (friendship: Friendship) => friendship.status === "accepted",
      ) ?? [],
    [friendships],
  );

  function getErrorMessage(error: unknown) {
    if (typeof error === "object" && error && "response" in error) {
      const response = (error as { response?: { data?: { message?: string } } })
        .response;
      return response?.data?.message || "Something went wrong.";
    }

    return "Something went wrong.";
  }

  function showSuccess(action: string) {
    const message =
      action === "sent"
        ? "Friend request sent."
        : action === "accepted"
          ? "Friend request accepted."
          : action === "cancelled"
            ? "Friend request cancelled."
            : "Friend removed.";

    setFeedback({ type: "success", message });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold font-serif">Friends</h1>
      </header>

      {feedback && (
        <div
          className={`mx-4 mt-4 rounded-lg border px-3 py-2 text-sm ${
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex-1">
        <div className="p-4 border-b border-border bg-mist/30">
          <h2 className="font-bold text-lg mb-2">Pending Requests</h2>
          {isFriendsLoading ? (
            <div className="py-4 flex justify-center">
              <Spinner />
            </div>
          ) : pendingRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending requests.
            </p>
          ) : (
            <div className="flex flex-col border border-border rounded-lg overflow-hidden">
              {pendingRequests.map((request: Friendship) => {
                const requester =
                  request.sender.id === currentUser?.id
                    ? request.receiver
                    : request.sender;
                const isOutgoingRequest = request.sender.id === currentUser?.id;
                return (
                  <UserCard
                    key={request.id}
                    user={requester}
                    action={
                      <div className="flex gap-2">
                        {isOutgoingRequest ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              cancelRequest(request.id, {
                                onSuccess: (data) => showSuccess(data.action),
                                onError: (error) =>
                                  setFeedback({
                                    type: "error",
                                    message: getErrorMessage(error),
                                  }),
                              })
                            }
                          >
                            Cancel
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                acceptRequest(request.id, {
                                  onSuccess: (data) => showSuccess(data.action),
                                  onError: (error) =>
                                    setFeedback({
                                      type: "error",
                                      message: getErrorMessage(error),
                                    }),
                                })
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                cancelRequest(request.id, {
                                  onSuccess: (data) => showSuccess(data.action),
                                  onError: (error) =>
                                    setFeedback({
                                      type: "error",
                                      message: getErrorMessage(error),
                                    }),
                                })
                              }
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="font-bold text-lg mb-2">Your Friends</h2>
          {isFriendsLoading ? (
            <div className="py-4 flex justify-center">
              <Spinner />
            </div>
          ) : acceptedFriends.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You haven't added any friends yet.
            </p>
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
                        variant="outline"
                        onClick={() =>
                          unfriend(friendship.id, {
                            onSuccess: (data) => showSuccess(data.action),
                            onError: (error) =>
                              setFeedback({
                                type: "error",
                                message: getErrorMessage(error),
                              }),
                          })
                        }
                      >
                        Unfriend
                      </Button>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
