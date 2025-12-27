"use client";

import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type ToastState = "idle" | "pending" | "processing" | "completed" | "failed";

export const GenerationToaster = () => {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    const socket = io(socketUrl);
    const [status, setStatus] = useState<ToastState>("idle");
    const [message, setMessage] = useState("");
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;
        const handleUpdate = (data: any) => {
            if (data.type === "processing") {
                setStatus("processing");
                setMessage("Generating magic...");
            }
            else if (data.type === "completed") {
                setStatus("completed");
                setMessage("Generation complete!");

                queryClient.invalidateQueries({ queryKey: ["gallery"] });
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
                queryClient.invalidateQueries({ queryKey: ["generations"] });

                setTimeout(() => setStatus("idle"), 4000);
            }
            else if (data.type === "failed") {
                setStatus("failed");
                setMessage("Generation failed.");
                setTimeout(() => setStatus("idle"), 5000);
            }
        };

        socket.on("jobUpdate", handleUpdate);

        return () => {
            socket.off("jobUpdate", handleUpdate);
        };
    }, [queryClient]);
    useEffect(() => {
        const handleStart = () => {
            setStatus("pending");
            setMessage("Queued...");
        };
        window.addEventListener("generation-started", handleStart);
        return () => window.removeEventListener("generation-started", handleStart);
    }, []);

    return (
        <AnimatePresence>
            {status !== "idle" && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 50, x: "-50%" }}
                    className="fixed top-8 left-1/2 transform z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
                >
                    {status === "pending" && <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />}
                    {status === "processing" && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                    {status === "completed" && <CheckCircle2 className="w-5 h-5 text-lime-500" />}
                    {status === "failed" && <XCircle className="w-5 h-5 text-red-500" />}

                    <span className="font-medium text-sm">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};