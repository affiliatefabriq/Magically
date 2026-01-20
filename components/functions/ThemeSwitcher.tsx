"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";

export const ThemeSwitcher = () => {
  const t = useTranslations("Components.Theme");
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme || systemTheme;

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  if (!mounted) return null;

  const handleThemeChange = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleThemeChange}
      className="cursor-pointer rounded-full py-2 w-full secondary-hover magic-transition"
    >
      {currentTheme === "dark" ? (
        <div className="flex items-center justify-start gap-2 w-full">
          <MoonIcon />
          <span>{t("dark")}</span>
        </div>
      ) : (
        <div className="flex items-center justify-start gap-2 w-full">
          <SunIcon />
          <span>{t("light")}</span>
        </div>
      )}
    </Button>
  );
};
