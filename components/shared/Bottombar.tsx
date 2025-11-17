"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Compass,
  Folder,
  Loader,
  Search,
  Sparkles,
  UserRound,
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
import { MagicButton } from "../ui/magic/magic-button";

export const Bottombar = () => {
  const t = useTranslations("Components.Sidebar");
  const pathname = usePathname();

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
      className="fixed md:hidden flex items-center justify-center left-0 right-0 bottom-2 z-10 w-full h-[64px] px-2"
    >
      <div className="flex items-center justify-center gap-4 rounded-2xl border p-3 backdrop-blur-xl mx-auto bg-white/50 dark:bg-black/20">
        {items.map((item) =>
          item.id === 3 ? (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger asChild>
                <MagicButton icon={item.icon} className="w-[36px] h-[36px] text-white" btn="rounded-lg" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="relative p-3 mx-auto rounded-xl overflow-hidden" align="center">
                <DropdownMenuLabel>{t("Create")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="mt-2 py-2">
                  <Link href="/create/magic-photo" className="flex items-center justify-between gap-2">
                    <Wand />
                    <span className="font-semibold">{t("MagicPhoto")}</span>
                    <div />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="mt-2 py-2">
                  <Link href="/create/effects" className="flex items-center justify-between gap-2">
                    <Loader />
                    <span className="font-semibold">{t("Effects")}</span>
                    <div />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
