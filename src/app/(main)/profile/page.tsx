"use client";

import * as React from "react";
import { useCurrentUser } from "@/hooks/useUser";
import { useUserThoughts } from "@/hooks/useThoughts";
import { ThoughtFeed } from "@/components/thoughts/ThoughtFeed";
import { Spinner } from "@/components/ui/Spinner";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";

export default function CurrentUserProfilePage() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: thoughts, isLoading: isThoughtsLoading } = useUserThoughts(
    user?.id,
  );
  const [isEditOpen, setIsEditOpen] = React.useState(false);

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
        Please log in to view your profile.
      </div>
    );
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
        isOwnProfile
        onEditProfile={() => setIsEditOpen(true)}
      />

      <ProfileEditModal
        user={user}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <div className="flex-1">
        <ThoughtFeed
          thoughts={thoughts}
          isLoading={isThoughtsLoading}
          emptyMessage="You haven't posted any thoughts yet."
        />
      </div>
    </div>
  );
}
