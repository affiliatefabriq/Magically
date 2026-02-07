"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Bot,
  Brush,
  Compass,
  Folder,
  Loader,
  Sparkles,
  TriangleAlert,
  UserRound,
  Video,
  Wand,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MagicButton } from "@/components/ui/magic/magic-button";

export const Bottombar = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Components.Sidebar");

  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [open, setOpen] = useState(false);

  // ---------- items ----------
  const items = [
    { id: 1, title: t("Explore"), url: "/", icon: Compass },
    { id: 2, title: t("Models"), url: "/models", icon: Bot },
    { id: 3, title: t("Create"), url: "/create", icon: Sparkles },
    { id: 4, title: t("Library"), url: "/library", icon: Folder },
    { id: 5, title: t("Profile"), url: "/profile", icon: UserRound },
  ];

  // ---------- hide on scroll ----------
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > prevScrollPos && current > 80) {
        setIsBottomBarVisible(false);
        setOpen(false);
      } else {
        setIsBottomBarVisible(true);
      }

      setPrevScrollPos(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // ---------- close on route change ----------
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ---------- navigate helper ----------
  const go = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  const bottomBarStyle = {
    transform: isBottomBarVisible ? "translateY(0)" : "translateY(120%)",
    transition: "transform .35s cubic-bezier(.4,0,.2,1)",
  };

  return (
    <nav
      style={bottomBarStyle}
      className="fixed md:hidden flex items-center justify-center left-0 right-0 bottom-0 z-10 w-full h-18 px-2"
    >
      <div className="flex items-center justify-center gap-3 rounded-2xl border p-3 backdrop-blur-xl mx-auto bg-white/50 dark:bg-black/20">
        {items.map((item) =>
          item.id === 3 ? (
            <DropdownMenu key={item.id} open={open} onOpenChange={setOpen} modal={false}>
              <DropdownMenuTrigger asChild>
                <MagicButton icon={item.icon} className="size-9 text-white" btn="rounded-lg" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="relative p-4 mx-auto rounded-xl overflow-hidden" align="center">
                <DropdownMenuLabel>{t("Create")}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* magic photo */}
                <DropdownMenuItem
                  onClick={() => go("/create/magic-photo")}
                  className="mt-2 py-3 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3 font-semibold">
                    <Wand className="size-4" />
                    {t("MagicPhoto")}
                  </div>
                </DropdownMenuItem>

                {/* dev items */}
                {[
                  { icon: Brush, label: t("Effects.PhotoEditor") },
                  { icon: Loader, label: t("Effects.PhotoEffects") },
                  { icon: Video, label: t("Effects.VideoEffects") },
                ].map((x, i) => (
                  <DropdownMenuItem
                    key={i}
                    className="mt-2 py-3 rounded-xl cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between w-full relative">

                      <div className="flex items-center gap-2 blur-[1px] opacity-70">
                        <x.icon className="size-4" />
                        <span className="font-semibold">{x.label}</span>
                      </div>

                      {/* оставить как есть */}
                      <div className="absolute right-0 flex items-center gap-1 text-xs font-bold text-yellow-300">
                        <TriangleAlert className="size-4 text-yellow-300" />
                        {t("InDevelopment")}
                      </div>

                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : item.id === 1 ? (
            <Link
              href={item.url}
              key={item.id}
              className={`relative flex flex-col items-center gap-4 rounded-lg p-2 font-semibold ${pathname === item.url ? "btn-magic" : ""}`}
            >
              <span className="flex justify-center items-center size-5">{locale === "ru" ? "В" : "M"}</span>
            </Link>
          ) : (
            <Link
              href={item.url}
              key={item.id}
              className={`relative flex flex-col items-center gap-4 rounded-lg p-2 font-thin ${pathname === item.url ? "btn-magic" : ""}`}
            >
              <item.icon strokeWidth={1.25} className="size-5" />
            </Link>
          )
        )}
      </div>
    </nav>
  );
};
