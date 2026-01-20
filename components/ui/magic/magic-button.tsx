"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export const MagicButton = ({ icon: Icon, className, title, btn, ...props }: any) => {
  const [stars, setStars] = useState<{ left: number; top: number; scale: number; delay: number }[]>([]);
  const [shooting, setShooting] = useState<{ delay: number }[]>([]);

  useEffect(() => {
    // Генерируем звезды только на клиенте
    const generatedStars = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 240,
      top: Math.random() * 55,
      scale: Math.random() * 2,
      delay: Math.random() * 5,
    }));

    const generatedShooting = Array.from({ length: 4 }).map(() => ({
      delay: Math.random() * 5,
    }));

    setStars(generatedStars);
    setShooting(generatedShooting);
  }, []);

  return (
    <div className={cn("special-btn", className)}>
      <button type="button" {...props} className={btn}>
        <div className="flex items-center justify-center w-full h-full">
          <Icon className="size-5" />
          {title && <p className="pl-2">{title}</p>}

          {shooting.map((s, i) => (
            <div
              key={`shoot-${i}`}
              className={`shooting-star shooting-star-${i + 1}`}
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}
        </div>
      </button>
    </div>
  );
};
