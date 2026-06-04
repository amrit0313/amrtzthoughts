'use client';

import * as React from 'react';
import Link from 'next/link';
import { useUsers } from '@/hooks/useUser';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-6">
        <h1 className="text-xl font-bold font-serif">Explore Users</h1>
      </header>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {users?.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground p-8">
            No other users found.
          </div>
        ) : (
          users?.map((user) => (
            <Link 
              href={`/profile/${user.id}`} 
              key={user.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <Avatar src={user.profilePic} alt={user.name || 'User'} size="md" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{user.name || 'Anonymous'}</h3>
                <p className="text-sm text-muted-foreground truncate">@{user.id}</p>
                {user.genre && (
                  <p className="text-xs text-muted-foreground capitalize mt-1 truncate">{user.genre}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
