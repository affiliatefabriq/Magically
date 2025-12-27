"use client";

import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { useUser } from "./useAuth";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

export const useSocket = () => {
  const { data: user } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    socketRef.current = io(socketUrl);

    socketRef.current.emit("registerUser", user.id);

    socketRef.current.on("jobUpdate", (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["activeGeneration"] });
      queryClient.invalidateQueries({ queryKey: ["generationHistory"] });
      queryClient.invalidateQueries({ queryKey: ["generation", data.jobId] });

      if (data.type === "completed") {
        toast.success(`Generation completed! (${data.service})`);
      } else if (data.type === "failed") {
        toast.error(`Generation failed: ${data.error}`);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, queryClient]);

  return socketRef.current;
};