"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useUserThoughts } from "@/hooks/useThoughts";
import { ThoughtFeed } from "@/components/thoughts/ThoughtFeed";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { UserRoundPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useSendFriendRequest,
  useUnfriend,
} from "@/hooks/useFriends";

export default function ProfilePage() {
  const { id } = useParams();
  const userId = typeof id === "string" ? parseInt(id, 10) : undefined;
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [friendshipFeedback, setFriendshipFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { data: profile, isLoading: isUserLoading } = useUser(userId as number);
  const { data: thoughts, isLoading: isThoughtsLoading } = useUserThoughts(
    userId as number,
  );
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const { mutateAsync: sendFriendRequest, isPending: isSendingFriendRequest } = useSendFriendRequest();
  const { mutateAsync: acceptFriendRequest, isPending: isAcceptingFriendRequest } = useAcceptFriendRequest();
  const { mutateAsync: cancelFriendRequest, isPending: isCancellingFriendRequest } = useCancelFriendRequest();
  const { mutateAsync: unfriend, isPending: isUnfriending } = useUnfriend();

  function getErrorMessage(error: unknown) {
    if (typeof error === "object" && error && "response" in error) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      return response?.data?.message || "Something went wrong.";
    }

    return "Something went wrong.";
  }

  function showActionFeedback(action: string) {
    const message =
      action === "sent"
        ? "Friend request sent."
        : action === "accepted"
          ? "Friend request accepted."
          : action === "cancelled"
            ? "Friend request cancelled."
            : "Friend removed.";

    setFriendshipFeedback({ type: "success", message });
  }

  if (isUserLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile?.user) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        User not found.
      </div>
    );
  }

  const { user, friendship } = profile;

  const isOwnProfile = currentUser?.id === user.id;
  const isPendingFromCurrentUser = friendship?.status === "pending" && friendship.sender.id === currentUser?.id;
  const friendshipLabel = isOwnProfile
    ? ""
    : friendship?.status === "accepted"
      ? "Unfriend"
      : friendship?.status === "pending"
        ? isPendingFromCurrentUser
          ? "Cancel Request"
          : "Accept Request"
        : "Add Friend";

  async function handleFriendshipAction() {
    if (!friendship) {
      try {
        const response = await sendFriendRequest(user.id);
        showActionFeedback(response.action);
        queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      } catch (error) {
        setFriendshipFeedback({ type: "error", message: getErrorMessage(error) });
      }

      return;
    }

    try {
      const response = friendship.status === "accepted"
        ? await unfriend(friendship.id)
        : isPendingFromCurrentUser
          ? await cancelFriendRequest(friendship.id)
          : await acceptFriendRequest(friendship.id);

      showActionFeedback(response.action);
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
    } catch (error) {
      setFriendshipFeedback({ type: "error", message: getErrorMessage(error) });
    }
  }

  return (
    <div className="flex flex-col min-h-screen gap-6">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-6">
        <h1 className="text-xl font-bold font-serif">
          {user.name || "Profile"}
        </h1>
      </header>

      <ProfileHero
        user={user}
        thoughtCount={thoughts?.length || 0}
        isOwnProfile={isOwnProfile}
        onEditProfile={() => setIsEditOpen(true)}
        secondaryAction={
          !isOwnProfile ? (
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={handleFriendshipAction}
                disabled={
                  isSendingFriendRequest ||
                  isAcceptingFriendRequest ||
                  isCancellingFriendRequest ||
                  isUnfriending
                }
              >
                <UserRoundPlus className="mr-2 h-4 w-4" />
                {friendshipLabel}
              </Button>
              {friendshipFeedback && (
                <p
                  className={`max-w-xs text-xs leading-5 ${
                    friendshipFeedback.type === "error" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {friendshipFeedback.message}
                </p>
              )}
            </div>
          ) : null
        }
      />

      {isOwnProfile && (
        <ProfileEditModal
          user={user}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      <div className="flex-1">
        <ThoughtFeed
          thoughts={thoughts}
          isLoading={isThoughtsLoading}
          emptyMessage={
            isOwnProfile
              ? "You haven't posted any thoughts yet."
              : "This user hasn't posted any thoughts yet."
          }
        />
      </div>
    </div>
  );
}
