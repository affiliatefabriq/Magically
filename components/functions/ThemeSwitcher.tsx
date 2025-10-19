"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";

// theme switcher component
export const ThemeSwitcher = () => {
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
    setTheme(newTheme); // Set theme after updating localStorage
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
          <span>Темная тема</span>
        </div>
      ) : (
        <div className="flex items-center justify-start gap-2 w-full">
          <SunIcon />
          <span>Светлая тема</span>
        </div>
      )}
    </Button>
  );
};
