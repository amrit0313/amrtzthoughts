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

export default function ProfilePage() {
  const { id } = useParams();
  const userId = typeof id === "string" ? parseInt(id, 10) : undefined;
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const { data: user, isLoading: isUserLoading } = useUser(userId as number);
  const { data: thoughts, isLoading: isThoughtsLoading } = useUserThoughts(
    userId as number,
  );
  const currentUser = useAuthStore((state) => state.user);

  if (isUserLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        User not found.
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

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
            <Button variant="outline" className="rounded-full px-6">
              Add Friend
            </Button>
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
