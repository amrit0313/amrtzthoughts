export interface User {
  id: number;
  email: string;
  name?: string;
  profilePic: string;
  genre: Genre;
}

export enum Genre {
  ROMANTIC = "romantic",
  THRILLER = "thriller",
  LITERATURE = "literature",
  COMEDY = "comedy",
  FANTASY = "fantasy",
  HUMOR = "humor",
  NEWS = "news",
  INTROVERT = "introvert",
}

export interface Thought {
  id: number;
  thought: string;
  user: User;
  likeCount: number;
  shareCount: number;
  createdAt: string; // ISO Date string
  // Assuming optional depending on relationships
}

export interface ThoughtLike {
  id: string;
  user: User;
  thought: Thought;
  createdAt: string;
}

export interface ThoughtShare {
  id: string;
  user: User;
  thought: Thought;
  createdAt: string;
}

export type FriendshipStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "blocked"
  | "unfriended";

export interface Friendship {
  id: number;
  sender: User;
  receiver: User;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}
