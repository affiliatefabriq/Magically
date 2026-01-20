"use client";

import { GenerationToaster } from "@/components/shared/create/GenerationToaster";
import { useSocket } from "@/hooks/useSocket";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  useSocket();
  return (
    <>
      <GenerationToaster />
      {children}
    </>
  );
};
