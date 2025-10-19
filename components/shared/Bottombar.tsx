"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Library, LibraryBig, Search, Sparkles, UserRound } from "lucide-react";

export const Bottombar = () => {
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
      icon: Library,
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
    transform: isBottomBarVisible ? "translateY(0)" : "translateY(110%)",
    transition: "transform 0.3s ease-in-out",
  };

  return (
    <nav
      style={bottomBarStyle}
      className="fixed md:hidden flex items-center justify-center left-0 right-0 bottom-2 z-10 w-full h-[64px] px-2"
    >
      <div className="flex items-center justify-center gap-4 rounded-2xl border p-3 backdrop-blur-xl mx-auto bg-white/50 dark:bg-black/20">
        {items.map((item) => {
          return (
            <Link
              href={item.url}
              key={item.id}
              className={`relative flex flex-col items-center gap-4 rounded-lg p-2 font-thin
                                ${pathname === item.url ? "btn-magic" : ""}`}
            >
              <item.icon strokeWidth={1.25} className="size-5" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
