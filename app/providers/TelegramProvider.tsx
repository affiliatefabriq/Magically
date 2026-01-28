"use client";

import api from "@/lib/api";
import { useEffect, useRef } from "react";
import { RootLayoutProps } from "@/types";

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

export const TelegramProvider = ({ children }: RootLayoutProps) => {
  const sentRef = useRef(false);

  useEffect(() => {
    const tryInit = () => {
      const tg = window?.Telegram?.WebApp;
      if (!tg) return false;

      tg.ready();
      tg.expand();

      if (!tg.initData || sentRef.current) return false;

      sentRef.current = true;

      api.post("/auth/telegram/webapp", {
        initData: tg.initData,
      })
        .then(() => {
          console.log("Telegram WebApp auto-login success");
        })
        .catch(err => {
          console.error("Telegram WebApp auth error", err);
          sentRef.current = false;
        });

      return true;
    };

    // пробуем сразу
    if (tryInit()) return;

    // fallback — ждём Telegram
    const interval = setInterval(() => {
      if (tryInit()) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
};
