import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Friendship, User } from "@/types";

export type FriendshipActionResponse = {
  success: boolean;
  friendshipStatus: "pending" | "accepted" | "none";
  action: "sent" | "accepted" | "cancelled" | "unfriended";
};

export function useFriends() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await api.get<Friendship[]>("/friendship");
      return data;
    },
  });
}

export function usePendingRequests() {
  return useQuery({
    queryKey: ["friends", "pending"],
    queryFn: async () => {
      const { data } = await api.get<Friendship[]>("/friendship");
      return data;
    },
  });
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (receiverId: number) => {
      const { data } = await api.post<FriendshipActionResponse>(
        `/friendship/request/${receiverId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (friendshipId: number) => {
      const { data } = await api.post<FriendshipActionResponse>(
        `/friendship/accept/${friendshipId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
}

export function useCancelFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (friendshipId: number) => {
      const { data } = await api.delete<FriendshipActionResponse>(
        `/friendship/request/${friendshipId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
}

export function useUnfriend() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (friendshipId: number) => {
      const { data } = await api.delete<FriendshipActionResponse>(
        `/friendship/${friendshipId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
}
