import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Genre, User, UserWithFriendship } from "@/types";
import { useAuthStore } from "@/store/auth.store";

export function useUser(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await api.get<UserWithFriendship>(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const { data } = await api.get<User>("/auth/me");
      return data;
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get<User[]>("/users");
      console.log(data);
      return data;
    },
  });
}

type UpdateProfileInput = {
  userId: number;
  genre: Genre;
  file?: File | null;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, genre, file }: UpdateProfileInput) => {
      console.log(genre, file);
      const formData = new FormData();
      formData.append("genre", genre ?? "");

      if (file) {
        formData.append("profilePic", file);
      }

      console.log(formData);
      const { data } = await api.patch<User>(`/users/profile`, formData);
      return data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", updatedUser.id], updatedUser);
      queryClient.setQueryData(["user", "me"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["thoughts"] });
      useAuthStore.getState().updateUser(updatedUser);
    },
  });
}
