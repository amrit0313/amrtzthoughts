'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { useCreateThought } from '@/hooks/useThoughts';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  thought: z.string().min(1, 'Cannot be empty').max(280, 'Maximum 280 characters'),
});

type FormData = z.infer<typeof schema>;

export function ThoughtComposer() {
  const { user } = useAuthStore();
  const { mutate: createThought, isPending } = useCreateThought();
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const thoughtValue = watch('thought', '');

  const onSubmit = (data: FormData) => {
    createThought(data.thought, {
      onSuccess: () => {
        reset();
      },
    });
  };

  if (!user) return null;

  return (
    <div className="flex gap-4 p-4 border-b border-border bg-paper">
      <Avatar src={user.profilePic} alt={user.name || 'User'} />
      <div className="flex-1">
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            {...register('thought')}
            placeholder="What's on your mind?"
            className="w-full bg-transparent resize-none outline-none text-lg min-h-[100px] placeholder:text-muted-foreground"
          />
          {errors.thought && (
            <p className="text-sm text-red-500 mb-2">{errors.thought.message}</p>
          )}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">
              {thoughtValue.length}/280
            </span>
            <Button 
              type="submit" 
              disabled={thoughtValue.length === 0 || isPending}
              className="rounded-full px-6"
            >
              {isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
