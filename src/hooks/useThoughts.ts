import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Thought } from '@/types';

export function useThoughts() {
  return useQuery({
    queryKey: ['thoughts'],
    queryFn: async () => {
      try {
        const { data } = await api.get<Thought[]>('/thoughts');
        return data;
      } catch (err: any) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
  });
}

export function useUserThoughts(userId: number | undefined) {
  return useQuery({
    queryKey: ['thoughts', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const { data } = await api.get<Thought[]>(`/thoughts/user/${userId}`);
        console.log((data))
        return data;
      } catch (err: any) {
        if (err.response?.status === 404) return [];
        throw err;
      }
    },
    enabled: !!userId,
  });
}

export function useCreateThought() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (thought: string) => {
      const { data } = await api.post<Thought>('/thoughts', { thought });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
    },
  });
}

export function useLikeThought() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/thoughts/${id}/like`);
      return data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['thoughts'] });
      const previousThoughts = queryClient.getQueryData<Thought[]>(['thoughts']);
      
      if (previousThoughts) {
        queryClient.setQueryData<Thought[]>(['thoughts'], (old) => 
          old?.map(t => t.id === id ? { ...t, likeCount: t.likeCount + 1 } : t)
        );
      }
      return { previousThoughts };
    },
    onError: (err, id, context) => {
      if (context?.previousThoughts) {
        queryClient.setQueryData(['thoughts'], context.previousThoughts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
    },
  });
}

export function useShareThought() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/thoughts/${id}/share`);
      return data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['thoughts'] });
      const previousThoughts = queryClient.getQueryData<Thought[]>(['thoughts']);
      
      if (previousThoughts) {
        queryClient.setQueryData<Thought[]>(['thoughts'], (old) => 
          old?.map(t => t.id === id ? { ...t, shareCount: t.shareCount + 1 } : t)
        );
      }
      return { previousThoughts };
    },
    onError: (err, id, context) => {
      if (context?.previousThoughts) {
        queryClient.setQueryData(['thoughts'], context.previousThoughts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['thoughts'] });
    },
  });
}
