"use client";

import Link from "next/link";
import {ChevronsUpDown, Cog, LogOut} from "lucide-react";
import {useTranslations} from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import {useLogout} from "@/hooks/useAuth";
import {UserAttributes} from "@/types";
import {UserAvatar} from "../user/UserAvatar";

export function NavUser(user: UserAttributes) {
  const t = useTranslations("Components.NavUser");
  const logoutMutation = useLogout();
  const {isMobile} = useSidebar();

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user && <UserAvatar {...user} size="md"/>}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.username}</span>
                <span className="text-xs">✦{user.tokens}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4"/>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {user && <UserAvatar {...user} size="md"/>}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.username}</span>
                  <span className={`flex flex-row gap-1`}>
                    <span className="truncate text-xs">✦{user.tokens}</span>
                    <Link href={'/pay'} className={`link-text text-xs`}>
                      {t('BalanceTopUp')}
                    </Link>
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="/settings" className="flex items-center gap-2">
                  <Cog/>
                  {t("Settings")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={logout}>
              <LogOut/>
              {t("Logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
