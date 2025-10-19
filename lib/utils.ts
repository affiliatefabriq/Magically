import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import { Publication } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (createdAt: string) => {
  const locale = localStorage.getItem("locale") || "en";

  const formattedDate = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: locale === "ru" ? ru : enUS,
  });

  return formattedDate;
};
