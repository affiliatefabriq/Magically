"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, Compass, Globe, Library, Search, Sparkles, UserRound } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useAuth";
import { LanguageSwitcher } from "../functions/LanguageSwitcher";
import { ThemeSwitcher } from "../functions/ThemeSwitcher";
import { AuroraText } from "../ui/magic/aurora-text";
import { NavUser } from "./user/NavUser";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useUser();

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

  return (
    <Sidebar>
      <SidebarContent className="theme border-none px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center my-6">
            <h1 className="text-xl font-bold">
              <AuroraText>Волшебный</AuroraText>
            </h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`p-[18px] mb-2 rounded-full text-md magic-transition
                                        ${pathname === item.url ? "magic-hover" : "secondary-hover"}`}
                  >
                    <Link href={item.url} className={`${pathname === item.url ? "btn-magic" : ""}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="theme border-none px-4">
        <SidebarMenu className="mt-2">
          <div className="flex flex-col items-start gap-2 my-4 w-full">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          {user ? (
            <NavUser {...user} />
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="p-[18px] mb-2 rounded-full text-md secondary-transition magic-transition "
              >
                <Link href="/login" className="btn-magic-secondary flex items-center justify-between">
                  <CircleUserRound />
                  <span className="font-semibold">Log In</span>
                  <div />
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-[18px] mb-2 rounded-full text-md magic-hover magic-transition">
                <Link href="/register" className="btn-magic flex items-center justify-between">
                  <Globe />
                  <span className="font-semibold">Register</span>
                  <div />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
