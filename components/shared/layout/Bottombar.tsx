'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  Brush,
  Compass,
  Folder,
  ImageIcon,
  Loader,
  Sparkle,
  TriangleAlert,
  UserRound,
  Video,
  Wand,
} from 'lucide-react';

import { useLocale, useTranslations } from 'next-intl';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const Bottombar = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Components.Sidebar');

  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [open, setOpen] = useState(false);

  // ---------- items ----------
  const items = [
    { id: 1, title: t('Explore'), url: '/', icon: Compass },
    // { id: 2, title: t('Models'), url: '/models', icon: ImageIcon },
    { id: 2, title: t('Create'), url: '/create', icon: Sparkle },
    { id: 3, title: t('Library'), url: '/library', icon: ImageIcon },
    { id: 4, title: t('Profile'), url: '/profile', icon: UserRound },
  ];

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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const go = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  const bottomBarStyle = {
    transform: isBottomBarVisible ? 'translateY(0)' : 'translateY(120%)',
    transition: 'transform .35s cubic-bezier(.4,0,.2,1)',
  };

  return (
    <nav
      style={bottomBarStyle}
      className="fixed md:hidden flex items-center justify-center left-0 right-0 bottom-0 z-10 w-full max-w-96 mx-auto px-4 pb-2"
    >
      <div className="flex items-center justify-evenly w-full rounded-full border border-border/50 py-2.5 backdrop-blur-xl bg-white/80 dark:bg-black/80">
        {items.map((item) =>
          item.id === 2 ? (
            <DropdownMenu
              key={item.id}
              open={open}
              onOpenChange={setOpen}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col gap-0.5 items-center justify-center text-lime-500">
                  <item.icon strokeWidth={2} className="size-5" />
                  <span className="text-[10px] font-medium leading-tight">
                    {t('Create')}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="relative p-4 mx-auto rounded-xl overflow-hidden"
                align="center"
              >
                {/* CREATE */}
                <DropdownMenuLabel className="sr-only">
                  {t('Create')}
                </DropdownMenuLabel>
                {/* MODELS */}
                <DropdownMenuItem
                  onClick={() => go('/models')}
                  className="mt-2 py-3 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3 font-semibold">
                    <Folder className="size-4" />
                    {t('Models')}
                  </div>
                </DropdownMenuItem>
                {/* MAGIC PHOTO */}
                <DropdownMenuItem
                  onClick={() => go('/create/magic-photo')}
                  className="mt-2 py-3 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3 font-semibold">
                    <Wand className="size-4" />
                    {t('MagicPhoto')}
                  </div>
                </DropdownMenuItem>
                {/* Photo editor */}
                <DropdownMenuItem className="mt-2 py-3 rounded-xl cursor-not-allowed">
                  <div className="flex items-start justify-between w-full relative">
                    <div className="flex items-center gap-2 blur-[2px] opacity-70">
                      <Brush className="size-4" />
                      <span className="font-semibold">
                        {t('Effects.PhotoEditor')}
                      </span>
                    </div>

                    <div className="absolute right-0 left-6 flex items-start justify-start gap-1 text-xs font-bold text-yellow-300">
                      <TriangleAlert className="size-4 text-yellow-300" />
                      {t('InDevelopment')}
                    </div>
                  </div>
                </DropdownMenuItem>
                {/* Photo effects */}
                {/* <DropdownMenuItem
                  className="mt-2 py-3 rounded-xl cursor-not-allowed"
                >
                  <div className="flex items-start justify-between w-full relative">
                    <div className="flex items-center gap-2 blur-[2px] opacity-70">
                      <Loader className="size-4" />
                      <span className="font-semibold">{t('Effects.PhotoEffects')}</span>
                    </div>

                    <div className="absolute right-0 left-6 flex items-start justify-start gap-1 text-xs font-bold text-yellow-300">
                      <TriangleAlert className="size-4 text-yellow-300" />
                      {t('InDevelopment')}
                    </div>
                  </div>
                </DropdownMenuItem> */}
                {/* Video effects */}
                {/* <DropdownMenuItem
                  className="mt-2 py-3 rounded-xl cursor-not-allowed"
                >
                  <div className="flex items-start justify-between w-full relative">
                    <div className="flex items-center gap-2 blur-[2px] opacity-70">
                      <Video className="size-4" />
                      <span className="font-semibold">{t('Effects.VideoEffects')}</span>
                    </div>

                    <div className="absolute right-0 left-6 flex items-start justify-start gap-1 text-xs font-bold text-yellow-300">
                      <TriangleAlert className="size-4 text-yellow-300" />
                      {t('InDevelopment')}
                    </div>
                  </div>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href={item.url}
              key={item.id}
              className={`flex flex-col gap-0.5 items-center justify-center rounded-xl transition-all duration-200 ${
                pathname === item.url
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95'
              }`}
            >
              <item.icon
                strokeWidth={pathname === item.url ? 2 : 1.5}
                className="size-5"
              />
              <span className="text-[10px] font-medium leading-tight">
                {item.title}
              </span>
            </Link>
          ),
        )}
      </div>
    </nav>
  );
};
