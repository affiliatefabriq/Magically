"use client";

import Link from "next/link";

import { useUser } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "../functions/ThemeSwitcher";
import { LanguageSwitcher } from "../functions/LanguageSwitcher";

import { NavUser } from "./user/NavUser";
import { AuroraText } from "../ui/magic/aurora-text";

import {
  ChevronRight,
  CircleUserRound,
  Compass,
  Folder,
  Globe,
  Loader,
  Search,
  Sparkles,
  UserRound,
  Wand
} from "lucide-react";

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

export function AppSidebar() {
  const t = useTranslations("Components.Sidebar");
  const pathname = usePathname();
  const { data: user, isLoading, isError } = useUser();

  const items = [
    {
      id: 1,
      title: t("Explore"),
      url: "/",
      icon: Compass,
    },
    {
      id: 2,
      title: t("Search"),
      url: "/search",
      icon: Search,
    },
    {
      id: 3,
      title: t("Create"),
      url: "/create",
      icon: Sparkles,
    },
    {
      id: 4,
      title: t("Library"),
      url: "/library",
      icon: Folder,
    },
    {
      id: 5,
      title: t("Profile"),
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
              {items.map((item) =>
                item.id === 3 ? (
                  <SidebarMenuItem key={item.title}>
                    <details className="group">
                      <summary
                        className={`list-none px-5 py-2 mb-2 rounded-full text-md magic-transition flex items-center justify-between cursor-pointer
                        ${pathname === item.url ? "magic-hover" : "secondary-hover"}`}
                      >
                        <div className={`${pathname === item.url ? "btn-magic" : "flex items-center gap-3"}`}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </div>
                        <span className="transition-transform duration-200 group-open:rotate-90">
                          <ChevronRight className="size-4" />
                        </span>
                      </summary>

                      <div className="flex flex-col pl-3 mt-2 gap-1">
                        <SidebarMenuButton asChild className="p-[12px] rounded-full text-md magic-transition">
                          <Link href="/create/magic-photo" className="btn-magic-secondary flex items-center justify-between">
                            <Wand />
                            <span className="font-semibold">{t("MagicPhoto")}</span>
                            <div />
                          </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild className="p-[12px] mb-1 rounded-full text-md magic-transition">
                          <Link href="/create/effects" className="btn-magic-secondary flex items-center justify-between">
                            <Loader />
                            <span className="font-semibold">{t("Effects")}</span>
                            <div />
                          </Link>
                        </SidebarMenuButton>
                      </div>
                    </details>
                  </SidebarMenuItem>
                ) : (
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
                )
              )}
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
                  <span className="font-semibold">{t("Login")}</span>
                  <div />
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-[18px] mb-2 rounded-full text-md magic-hover magic-transition">
                <Link href="/register" className="btn-magic flex items-center justify-between">
                  <Globe />
                  <span className="font-semibold">{t("Register")}</span>
                  <div />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};