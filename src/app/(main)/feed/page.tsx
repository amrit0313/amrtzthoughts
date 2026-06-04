'use client';

import * as React from 'react';
import { useThoughts } from '@/hooks/useThoughts';
import { ThoughtComposer } from '@/components/thoughts/ThoughtComposer';
import { ThoughtFeed } from '@/components/thoughts/ThoughtFeed';

export default function FeedPage() {
  const { data: thoughts, isLoading } = useThoughts();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold font-serif">Home</h1>
      </header>
      
      <ThoughtComposer />
      
      <ThoughtFeed 
        thoughts={thoughts} 
        isLoading={isLoading} 
        emptyMessage="No thoughts to show yet. Be the first to share!" 
      />
    </div>
  );
}
