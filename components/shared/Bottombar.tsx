"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MagicButton } from "../ui/magic/magic-button";
import { useLocale, useTranslations } from "next-intl";

import {
  Brush,
  Compass,
  Folder,
  Loader,
  Search,
  Sparkles,
  TriangleAlert,
  UserRound,
  Video,
  Wand
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Bottombar = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Components.Sidebar");

  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const items = [
    {
      id: 1,
      title: "Explore",
      url: "/",
      icon: Compass,
    },
    {
      id: 2,
      title: "Search",
      url: "/search",
      icon: Search,
    },
    {
      id: 3,
      title: "Create",
      url: "/create",
      icon: Sparkles,
    },
    {
      id: 4,
      title: "Library",
      url: "/library",
      icon: Folder,
    },
    {
      id: 5,
      title: "Profile",
      url: "/profile",
      icon: UserRound,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos > prevScrollPos && currentScrollPos > 100) {
        setIsBottomBarVisible(false);
      } else {
        setIsBottomBarVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const bottomBarStyle = {
    transform: isBottomBarVisible ? "translateY(0)" : "translateY(115%)",
    transition: "transform 0.3s ease-in-out",
  };

  return (
    <nav
      style={bottomBarStyle}
      className="fixed md:hidden flex items-center justify-center left-0 right-0 bottom-2 z-10 w-full h-16 px-2"
    >
      <div className="flex items-center justify-center gap-4 rounded-2xl border p-3 backdrop-blur-xl mx-auto bg-white/50 dark:bg-black/20">
        {items.map((item) =>
          item.id === 3 ? (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger asChild>
                <MagicButton icon={item.icon} className="w-9 h-9 text-white" btn="rounded-lg" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="relative p-4 mx-auto rounded-xl overflow-hidden" align="center">
                <DropdownMenuLabel>{t("Create")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="mt-2 py-2">
                  {/* <Link href="/create/magic-photo" className="flex items-center justify-start gap-2"> */}
                  <div className="btn-magic-secondary flex items-center justify-start relative cursor-not-allowed">
                    <div className="flex items-center relative gap-1 blur-xs">
                      <Wand className="size-4" />
                      <span className="font-semibold z-20">{t("MagicPhoto")}</span>
                    </div>
                    <div className="absolute flex items-center gap-2 text-xs font-bold text-yellow-200">
                      <TriangleAlert className="size-4 text-yellow-200" />
                      {t("InDevelopment")}
                    </div>
                  </div>
                  {/* </Link> */}
                </DropdownMenuItem>
                <DropdownMenuItem className="mt-2 py-2">
                  <Link href="/create/photo-editor" className="flex items-center justify-start gap-2">
                    <Brush />
                    <span className="font-semibold">{t("Effects.PhotoEditor")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="mt-2 py-2">
                  <Link href="/create/photo-effects" className="flex items-center justify-start gap-2">
                    <Loader />
                    <span className="font-semibold">{t("Effects.PhotoEffects")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="mt-2 py-2">
                  <Link href="/create/video-effects" className="flex items-center justify-start gap-2">
                    <Video />
                    <span className="font-semibold">{t("Effects.VideoEffects")}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : item.id === 1 ? (
            <Link
              href={item.url}
              key={item.id}
              className={`relative flex flex-col items-center gap-4 rounded-lg p-2 font-semibold ${pathname === item.url ? "btn-magic" : ""}`}
            >
              <span className="flex justify-center items-center size-5">{locale === 'ru' ? 'В' : 'M'}</span>
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
