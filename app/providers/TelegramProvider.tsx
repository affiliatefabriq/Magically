"use client";

import api from "@/lib/api";
import { useEffect } from "react";

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp;

    if (!tg || !tg.initData) return;

    tg.ready();

    api.post("/auth/telegram/webapp", {
      initData: tg.initData,
    })
      .then(() => {
        console.log("Telegram WebApp auto-login success");
      })
      .catch((err) => {
        console.error("Telegram WebApp auth error", err);
      });
  }, []);

  return <>{children}</>;
};
