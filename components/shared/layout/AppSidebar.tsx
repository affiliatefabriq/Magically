"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brush,
  CircleUserRound,
  Compass,
  Folder,
  Globe,
  Loader,
  Search,
  Sparkles,
  TriangleAlert,
  UserRound,
  Video,
  Wand,
  Coins
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
import { LanguageSwitcher } from "@/components/functions/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/functions/ThemeSwitcher";
import { AuroraText } from "@/components/ui/magic/aurora-text";
import { MagicButton } from "@/components/ui/magic/magic-button";
import { NavUser } from "@/components/shared/user/NavUser";

export const AppSidebar = () => {
  const t = useTranslations("Components.Sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const summaryRef = useRef<HTMLElement | null>(null);
  const profileRef = useRef<HTMLElement | null>(null);

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
          <SidebarGroupLabel className="flex items-center gap-2 my-6">
            <Image
              src="/assets/logo.jpg"
              alt="logo"
              width={36}
              height={36}
              className="border border-violet-500 rounded-lg"
            />
            <h1 className="text-xl font-bold">
              <AuroraText>{t("Logo")}</AuroraText>
            </h1>
          </SidebarGroupLabel>
          <SidebarGroupContent className="font-medium">
            <SidebarMenu className="mt-2">
              {items.map((item) =>
                item.id === 3 ? (
                  <SidebarMenuItem key={item.title}>
                    <details className="group">
                      <summary
                        className={`list-none rounded-full text-md magic-transition flex items-center justify-between cursor-pointer`}
                        ref={summaryRef}
                      >
                        <div
                          className={`w-full mb-2 ${pathname === item.url ? "btn-magic" : "flex items-center gap-3"}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            summaryRef.current?.click();
                          }}
                        >
                          <MagicButton
                            icon={item.icon}
                            title={t("Create")}
                            className="w-full"
                            btn="px-5 py-2 rounded-full text-white"
                          />
                        </div>
                      </summary>

                      <div className="flex flex-col pl-3 mt-2 gap-1">
                        <SidebarMenuButton asChild className="p-3 rounded-full text-md magic-transition">
                          <Link
                            href="/create/magic-photo/"
                            className="btn-magic-secondary flex items-center justify-start"
                          >
                            <Wand className="size-5" />
                            <span className="font-semibold z-20">{t("MagicPhoto")}</span>
                          </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild className="p-3 rounded-full text-md magic-transition">
                          <Link
                            href="/"
                            className="btn-magic-secondary flex items-center justify-start relative cursor-not-allowed"
                          >
                            <div className="flex items-center relative gap-1 blur-xs">
                              <Brush />
                              <span className="font-semibold">{t("Effects.PhotoEditor")}</span>
                            </div>
                            <div className="absolute flex items-center gap-1 text-xs font-bold text-yellow-200">
                              <TriangleAlert className="size-5" />
                              {t("InDevelopment")}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild className="p-3 rounded-full text-md magic-transition">
                          <Link
                            href="/"
                            className="btn-magic-secondary flex items-center justify-start relative cursor-not-allowed"
                          >
                            <div className="flex items-center relative gap-1 blur-xs">
                              <Loader />
                              <span className="font-semibold">{t("Effects.PhotoEffects")}</span>
                            </div>
                            <div className="absolute flex items-center gap-1 text-xs font-bold text-yellow-200">
                              <TriangleAlert className="size-5" />
                              {t("InDevelopment")}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild className="p-3 mb-1 rounded-full text-md magic-transition">
                          <Link
                            href="/"
                            className="btn-magic-secondary flex items-center justify-start relative cursor-not-allowed"
                          >
                            <div className="flex items-center relative gap-1 blur-xs">
                              <Video />
                              <span className="font-semibold">{t("Effects.VideoEffects")}</span>
                            </div>
                            <div className="absolute flex items-center gap-1 text-xs font-bold text-yellow-200">
                              <TriangleAlert className="size-5" />
                              {t("InDevelopment")}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </div>
                    </details>
                  </SidebarMenuItem>
                ) : item.id === 1 ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`p-4.5 mb-2 rounded-full text-md magic-transition
                          ${pathname === item.url ? "magic-hover" : "secondary-hover"}`}
                    >
                      <Link href={item.url} className={`${pathname === item.url ? "btn-magic" : ""}`}>
                        <span className="flex justify-center items-center size-5">{locale === "ru" ? "В" : "M"}</span>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : item.id === 5 && user ? (
                  <SidebarMenuItem key={item.title}>
                    <details className="group">
                      <summary
                        className={`list-none rounded-full text-md magic-transition flex items-center justify-between cursor-pointer`}
                        ref={profileRef}
                      >
                        <SidebarMenuButton
                          asChild
                          className={`p-4.5 mb-2 rounded-full text-md magic-transition
                          ${pathname === item.url ? "magic-hover" : "secondary-hover"}`}
                          onClick={(e) => {
                            profileRef.current?.click();
                          }}
                        >
                          <Link href={item.url} className={`${pathname === item.url ? "btn-magic" : ""}`}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </summary>

                      <div className="flex flex-col pl-3 mt-2 gap-1">
                        <SidebarMenuButton asChild className="p-3 rounded-full text-md magic-transition">
                          <Link
                            href="/pay"
                            className="btn-magic-secondary flex items-center justify-start"
                          >
                            <Coins className="size-5" />
                            <span className="font-semibold z-20">{t("BalanceTopUp")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </div>
                    </details>
                  </SidebarMenuItem>
                )
                  : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`p-4.5 mb-2 rounded-full text-md magic-transition
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
                className="p-4.5 mb-2 rounded-full text-md secondary-transition magic-transition "
              >
                <Link href="/login" className="btn-magic-secondary flex items-center justify-between">
                  <CircleUserRound />
                  <span className="font-semibold">{t("Login")}</span>
                  <div />
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="p-4.5 mb-2 rounded-full text-md magic-hover magic-transition">
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