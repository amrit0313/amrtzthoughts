import * as React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Repeat2, MoreHorizontal } from 'lucide-react';
import { Thought } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { useLikeThought, useShareThought } from '@/hooks/useThoughts';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

interface ThoughtCardProps {
  thought: Thought;
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  const { user } = useAuthStore();
  const { mutate: likeThought } = useLikeThought();
  const { mutate: shareThought } = useShareThought();

  const handleLike = () => {
    likeThought(thought.id);
  };

  const handleShare = () => {
    shareThought(thought.id);
  };

  return (
    <div className="flex gap-4 p-4 border-b border-border bg-paper hover:bg-mist/50 transition-colors">
      <Link href={`/profile/${thought.user.id}`}>
        <Avatar src={thought.user.profilePic} alt={thought.user.name || 'User'} />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href={`/profile/${thought.user.id}`} className="font-bold hover:underline truncate">
              {thought.user.name || 'Anonymous'}
            </Link>
            <span className="text-muted-foreground truncate">
              @{thought.user.id}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground whitespace-nowrap">
              {thought.createdAt ? formatDistanceToNow(new Date(thought.createdAt), { addSuffix: true }) : 'Just now'}
            </span>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal size={18} />
          </button>
        </div>
        
        <p className="mt-1 text-foreground whitespace-pre-wrap break-words">
          {thought.thought}
        </p>
        
        <div className="flex items-center gap-6 mt-3 text-muted-foreground">
          <button 
            onClick={handleLike}
            className="flex items-center gap-1.5 hover:text-red-500 transition-colors group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-red-500/10">
              <Heart size={18} />
            </div>
            <span className="text-sm">{thought.likeCount || 0}</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-green-500 transition-colors group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-green-500/10">
              <Repeat2 size={18} />
            </div>
            <span className="text-sm">{thought.shareCount || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
