'use client';

import Link from 'next/link';

import { useToggleLocale } from '@/components/functions/LanguageSwitcher';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useUser } from '@/hooks/useAuth';

import { NavUser } from '@/components/shared/user/NavUser';

import {
  CircleUserRound,
  Folder,
  Globe,
  Wand,
  Coins,
  ImageIcon,
  Compass,
  GlobeIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export const AppSidebar = () => {
  const t = useTranslations('Components.Sidebar');
  const pathname = usePathname();

  const { currentLocale, isPending, toggleLocale } = useToggleLocale();
  const { data: user } = useUser();

  const items = [
    {
      id: 1,
      title: t('Explore'),
      url: '/',
      icon: Compass,
    },
    {
      id: 2,
      title: t('MagicPhoto'),
      url: '/create/magic-photo',
      icon: Wand,
    },
    {
      id: 3,
      title: t('Library'),
      url: '/library',
      icon: ImageIcon,
    },
    {
      id: 4,
      title: t('Models'),
      url: '/models',
      icon: Folder,
    },
    {
      id: 5,
      title: t('Tariffs'),
      url: '/tariffs',
      icon: Coins,
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupContent className="font-medium">
            <SidebarMenu className="mt-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`p-4.5 mb-2 rounded-lg text-md magic-transition magic-hover`}
                  >
                    <Link
                      href={item.url}
                      className={`${pathname === item.url ? 'sidebar-btn' : ''}`}
                    >
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={currentLocale}
              onClick={toggleLocale}
              disabled={isPending}
              className='gap-2 my-4'
            >
              <GlobeIcon className="size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className='p-0! m-0!'
                size="lg"
              >
                <NavUser {...user} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={t('Login')}
                className="p-4.5 mb-2 rounded-lg text-md secondary-transition magic-transition"
              >
                <Link
                  href="/login"
                  className="btn-magic-secondary flex items-center justify-between"
                >
                  <CircleUserRound />
                  <span className="font-semibold">{t('Login')}</span>
                  <div />
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton
                asChild
                tooltip={t('Register')}
                className="p-4.5 mb-2 rounded-lg text-md magic-hover magic-transition"
              >
                <Link
                  href="/register"
                  className="bg-fuchsia-800/20 sidebar-btn flex items-center justify-between"
                >
                  <Globe />
                  <span className="font-semibold">{t('Register')}</span>
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