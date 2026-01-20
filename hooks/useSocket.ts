"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";

import { useUser } from "./useAuth";

export const useSocket = () => {
  const { data: user } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.emit("registerUser", user.id);

    socket.on("jobUpdate", (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["activeGeneration"] });

      queryClient.invalidateQueries({ queryKey: ["generation", data.jobId] });
      queryClient.invalidateQueries({ queryKey: ["generationHistory"] });
    });

    return () => {
      socket.off("jobUpdate");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, queryClient]);

  return socketRef.current;
};
