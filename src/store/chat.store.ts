import { create } from "zustand";
import { User } from "@/types";

interface ChatState {
  activeChatFriend: User | null;
  setActiveChat: (friend: User | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeChatFriend: null,
  setActiveChat: (friend) => set({ activeChatFriend: friend }),
}));
