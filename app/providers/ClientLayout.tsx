"use client";

import { useSocket } from "@/hooks/useSocket";
import { GenerationToaster } from "@/components/shared/create/GenerationToaster";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
    useSocket();
    return (
        <>
            <GenerationToaster />
            {children}
        </>
    );
};