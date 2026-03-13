'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  Brush,
  Compass,
  ImageIcon,
  TriangleAlert,
  UserRound,
  Wand,
  WandSparkles,
} from 'lucide-react';

import { useTranslations } from 'next-intl';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Bottombar = () => {
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
    { id: 2, title: t('Create'), url: '/create', icon: WandSparkles },
    { id: 3, title: t('Library'), url: '/library', icon: ImageIcon },
    // { id: 4, title: t('Tariffs'), url: '/tariffs', icon: Coins },
    { id: 5, title: t('Profile'), url: '/profile', icon: UserRound },
  ];

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const hide = () => {
      setIsBottomBarVisible(false);
      setOpen(false);
    };

    const show = () => {
      setIsBottomBarVisible(true);
    };

    // const resetTimer = () => {
    //   clearTimeout(idleTimer);
    //   idleTimer = setTimeout(hide, 3000);
    // };

    const handleUserActivity = () => {
      show();
      // resetTimer();
    };

    const handleScroll = () => {
      const current = window.scrollY;

      // если скролл вниз — скрываем сразу
      if (current > lastScrollY && current > 80) {
        hide();
      } else {
        show();
      }

      lastScrollY = current;

      // resetTimer();
    };

    const activityEvents: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'touchstart',
      'keydown',
    ];

    activityEvents.forEach((event) =>
      window.addEventListener(event, handleUserActivity, { passive: true }),
    );

    window.addEventListener('scroll', handleScroll, { passive: true });

    // resetTimer();

    return () => {
      // clearTimeout(idleTimer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, handleUserActivity),
      );
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const bottomBarStyle = {
    transform: isBottomBarVisible ? 'translateY(0)' : 'translateY(120%)',
    transition: 'transform .35s cubic-bezier(.4,0,.2,1)',
  };

  return (
    <nav
      style={bottomBarStyle}
      className="fixed md:hidden flex items-center justify-center left-0 right-0 bottom-0 z-10 w-full max-w-80 mx-auto px-4 pb-2"
    >
      <div className="flex items-center justify-evenly w-full rounded-full border border-border/50 py-2.5 backdrop-blur-xl bg-white/80 dark:bg-neutral-950/80">
        {items.map((item) =>
          item.id === 2 ? (
            <DropdownMenu
              key={item.id}
              open={open}
              onOpenChange={setOpen}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col gap-0.5 items-center justify-center text-fuchsia-500">
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
                {/* <DropdownMenuItem
                  onClick={() => router.push('/models')}
                  className="mt-2 py-3 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3 font-semibold">
                    <Folder className="size-4" />
                    {t('Models')}
                  </div>
                </DropdownMenuItem> */}
                {/* MAGIC PHOTO */}
                <DropdownMenuItem
                  onClick={() => router.push('/create/magic-photo')}
                  className="mt-2 py-3 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3 font-semibold">
                    <WandSparkles className="size-4" />
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
