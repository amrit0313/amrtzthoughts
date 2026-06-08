"use-client";

import { io, Socket } from "socket.io-client";
import { getApiBaseUrl } from "./api";

let socket: Socket | null = null;

// export const connectSocket = (token: string): Socket => {
//   if (socket?.connected) return socket;

//   if (socket) {
//     (socket as Socket).disconnect();
//     socket = null;
//   }

//   socket = io(getApiBaseUrl(), {
//     auth: { token },
//     transports: ["websocket"],
//   });

//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

// export const getSocket = () => socket;

export const connectSocket = (token: string): Socket => {
  console.log("connectSocket called, token:", token ? "exists" : "NULL");
  console.log(
    "current socket state:",
    socket?.connected ? "connected" : "not connected",
  );

  if (socket?.connected) return socket;

  if (socket) {
    (socket as Socket).disconnect();
    socket = null;
  }

  socket = io(getApiBaseUrl(), {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("socket connected ✅", socket?.id));
  socket.on("connect_error", (err) =>
    console.log("socket error ❌", err.message),
  );
  socket.on("disconnect", (reason) =>
    console.log("socket disconnected", reason),
  );
  // Catch-all: log EVERY event from the backend so we know exact event names
  socket.onAny((event, ...args) => {
    console.log("[socket] event:", event, args);
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
