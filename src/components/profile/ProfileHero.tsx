"use client";

import * as React from "react";
import { PencilLine, Sparkles, UserRoundPlus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { User } from "@/types";

interface ProfileHeroProps {
  user: User;
  thoughtCount: number;
  isOwnProfile: boolean;
  onEditProfile: () => void;
  secondaryAction?: React.ReactNode;
}

function formatGenre(genre?: string) {
  if (!genre) return "Not set";
  return genre.charAt(0).toUpperCase() + genre.slice(1);
}

export function ProfileHero({
  user,
  thoughtCount,
  isOwnProfile,
  onEditProfile,
  secondaryAction,
}: ProfileHeroProps) {
  const actionLabel = "Edit profile";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,#ffffff_0%,#f5f5f5_100%)] p-6 shadow-sm sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.05),transparent_28%)]" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar
              src={user.profilePic}
              alt={user.name || "User"}
              size="xl"
              className="h-24 w-24 rounded-2xl border border-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
            />
            <div className="absolute -bottom-2 -right-2 rounded-full border border-border bg-white p-2 shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Profile
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {user.name || "Anonymous"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">@{user.id}</p>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {isOwnProfile
                ? "Keep your public profile sharp. Update your photo and genre so every thought feels current."
                : "A quick snapshot of their profile and recent activity."}
            </p>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-black">
                {thoughtCount} thoughts
              </div>
              <div className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium capitalize text-black">
                {formatGenre(user.genre)}
              </div>
              {isOwnProfile && (
                <div className="rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-medium text-black">
                  {user.email}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          {secondaryAction}
          <Button
            type="button"
            variant={isOwnProfile ? "primary" : "outline"}
            onClick={onEditProfile}
            className="rounded-full px-5"
          >
            {isOwnProfile ? (
              <PencilLine className="mr-2 h-4 w-4" />
            ) : (
              <UserRoundPlus className="mr-2 h-4 w-4" />
            )}
            {actionLabel}
          </Button>
          <p className="max-w-xs text-xs leading-5 text-muted-foreground">
            {isOwnProfile
              ? "Changes sync across your avatar, sidebar, and thought cards."
              : "This button is ready for a friend request flow when the backend is wired."}
          </p>
        </div>
      </div>
    </section>
  );
}
