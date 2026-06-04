'use client';

import * as React from 'react';
import Link from 'next/link';
import { useFriends, usePendingRequests, useAcceptFriendRequest, useDeclineFriendRequest } from '@/hooks/useFriends';
import { useAuthStore } from '@/store/auth.store';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { User } from '@/types';

function UserCard({ user, action }: { user: User; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-paper hover:bg-mist/50 transition-colors">
      <Link href={`/profile/${user.id}`} className="flex items-center gap-3">
        <Avatar src={user.profilePic} alt={user.name || 'User'} />
        <div>
          <div className="font-bold hover:underline">{user.name || 'Anonymous'}</div>
          <div className="text-sm text-muted-foreground">@{user.id}</div>
        </div>
      </Link>
      {action && <div>{action}</div>}
    </div>
  );
}

export default function FriendsPage() {
  const currentUser = useAuthStore(state => state.user);
  const { data: friends, isLoading: isFriendsLoading } = useFriends();
  const { data: requests, isLoading: isRequestsLoading } = usePendingRequests();
  
  const { mutate: acceptRequest } = useAcceptFriendRequest();
  const { mutate: declineRequest } = useDeclineFriendRequest();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold font-serif">Friends</h1>
      </header>
      
      <div className="flex-1">
        <div className="p-4 border-b border-border bg-mist/30">
          <h2 className="font-bold text-lg mb-2">Pending Requests</h2>
          {isRequestsLoading ? (
            <div className="py-4 flex justify-center"><Spinner /></div>
          ) : !requests || requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests.</p>
          ) : (
            <div className="flex flex-col border border-border rounded-lg overflow-hidden">
              {requests.map(request => {
                const requester = request.sender;
                return (
                  <UserCard 
                    key={request.id} 
                    user={requester} 
                    action={
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => acceptRequest(request.id)}>Accept</Button>
                        <Button size="sm" variant="outline" onClick={() => declineRequest(request.id)}>Decline</Button>
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
            <div className="py-4 flex justify-center"><Spinner /></div>
          ) : !friends || friends.length === 0 ? (
            <p className="text-sm text-muted-foreground">You haven't added any friends yet.</p>
          ) : (
            <div className="flex flex-col border border-border rounded-lg overflow-hidden">
              {friends.map(friendship => {
                const friend = friendship.sender.id === currentUser?.id ? friendship.receiver : friendship.sender;
                return (
                  <UserCard 
                    key={friendship.id} 
                    user={friend} 
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
