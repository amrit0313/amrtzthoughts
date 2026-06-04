import * as React from 'react';
import { Thought } from '@/types';
import { ThoughtCard } from './ThoughtCard';
import { Spinner } from '@/components/ui/Spinner';

interface ThoughtFeedProps {
  thoughts?: Thought[];
  isLoading: boolean;
  emptyMessage?: string;
}

export function ThoughtFeed({ 
  thoughts = [], 
  isLoading, 
  emptyMessage = 'No thoughts yet.' 
}: ThoughtFeedProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!thoughts || thoughts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground text-center">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {thoughts.map((thought) => (
        <ThoughtCard key={thought.id} thought={thought} />
      ))}
    </div>
  );
}
