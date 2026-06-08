import { io, Socket } from "socket.io-client";
import { getApiBaseUrl } from "./api";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket) return socket;
  socket = io(getApiBaseUrl(), {
    auth: { token },
      transports: ['websocket'],

  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
