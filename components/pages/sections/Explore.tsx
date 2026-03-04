'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';

import { PublicationCard } from '@/components/shared/publication/PublicationCard';
import { RecommendedUsersCarousel } from '@/components/shared/user/RecommendedUsersCarousel';
import { TrendsList } from '@/components/shared/publication/TrendsList';
import { WelcomeHero } from '@/components/shared/layout/WelcomeHero';

import { ExploreEmpty } from '@/components/states/empty/Empty';
import { ExploreError } from '@/components/states/error/Error';
import { ExploreLoader } from '@/components/states/loaders/Loaders';

import { ShootingStars } from '@/components/ui/magic/shooting-stars';
import { StarsBackground } from '@/components/ui/magic/stars-background';

import { useUser } from '@/hooks/useAuth';
import { usePublications } from '@/hooks/usePublications';
import { useRecommendedUsers } from '@/hooks/useSearch';

const CAROUSEL_INTERVAL = 50;

export type DisplayMode = 'default' | 'grid';

function getColumnCount(mode: DisplayMode): number {
  if (typeof window === 'undefined') return mode === 'grid' ? 2 : 4;
  const w = window.innerWidth;
  if (mode === 'grid') {
    if (w >= 1024) return 4;
    if (w >= 640) return 3;
    return 2;
  }
  // default masonry
  if (w >= 1280) return 4;
  if (w >= 1024) return 3;
  if (w >= 640) return 2;
  return 1;
}

function useColumnCount(mode: DisplayMode) {
  const [cols, setCols] = useState(() => getColumnCount(mode));
  useEffect(() => {
    const handler = () => setCols(getColumnCount(mode));
    const ro = new ResizeObserver(handler);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [mode]);
  return cols;
}

function distributeToColumns<T>(items: T[], colCount: number): T[][] {
  const columns: T[][] = Array.from({ length: colCount }, () => []);
  items.forEach((item, i) => columns[i % colCount].push(item));
  return columns;
}

const MasonryGrid = ({
  items,
  renderItem,
  mode = 'default',
}: {
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  mode?: DisplayMode;
}) => {
  const cols = useColumnCount(mode);
  const columns = useMemo(
    () => distributeToColumns(items, cols),
    [items, cols],
  );

  return (
    <div className="flex gap-2 w-full items-start">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col flex-1 min-w-0 gap-2">
          {col.map((item) => renderItem(item))}
        </div>
      ))}
    </div>
  );
};

function buildChunks(publications: any[]) {
  const chunks: Array<
    { type: 'posts'; items: any[] } | { type: 'carousel'; key: string }
  > = [];
  let i = 0;
  let chunkIndex = 0;
  while (i < publications.length) {
    const slice = publications.slice(i, i + CAROUSEL_INTERVAL);
    chunks.push({ type: 'posts', items: slice });
    i += CAROUSEL_INTERVAL;
    if (i < publications.length || slice.length === CAROUSEL_INTERVAL) {
      chunks.push({ type: 'carousel', key: `carousel-${chunkIndex}` });
    }
    chunkIndex++;
  }
  return chunks;
}

const SkeletonCard = ({ height }: { height: number }) => (
  <div
    className="w-full rounded-xl bg-muted/40 animate-pulse"
    style={{ height }}
  />
);

const SKELETON_HEIGHTS = [
  200, 280, 180, 320, 240, 200, 260, 300, 220, 180, 340, 200,
];

export const Explore = () => {
  const t = useTranslations('Pages.Explore');
  const { theme } = useTheme();
  const [filters] = useState({ sortBy: 'newest', hashtag: '' });
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');

  const { data: user } = useUser();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePublications(filters);

  const { data: recommendedUsers, isLoading: isLoadingRecommended } =
    useRecommendedUsers(true, 20);

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.5 },
    );
    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPublications = useMemo(
    () => data?.pages.flatMap((page) => page.publications) ?? [],
    [data],
  );
  const chunks = useMemo(() => buildChunks(allPublications), [allPublications]);
  const carouselUsers = useMemo(
    () => recommendedUsers?.slice(0, 15) ?? [],
    [recommendedUsers],
  );

  const starColor = theme === 'dark' ? '#FFFFFF' : '#111111';
  const trailColor = theme === 'dark' ? '#F020F0' : '#A174D1';

  if (isLoading) {
    return (
      <div className="section-padding space-y-6">
        <div className="h-52 rounded-2xl bg-muted/20 animate-pulse" />
        <MasonryGrid
          mode="grid"
          items={SKELETON_HEIGHTS.slice(0, 8).map((h, i) => ({ id: i, h }))}
          renderItem={(item) => <SkeletonCard key={item.id} height={item.h} />}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="section-padding state-center">
        <ExploreError />
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <StarsBackground className="h-full w-full opacity-100" />
        <ShootingStars
          starColor={starColor}
          trailColor={trailColor}
          className="h-full w-full"
        />
      </div>

      <div className="relative z-10 w-full h-full section-padding">
        {/* Welcome */}
        <WelcomeHero />

        {/* Тренды */}
        <div className="mt-2 mb-6">
          <TrendsList />
        </div>

        {/* Лента сообщества */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-semibold text-sm tracking-wide">
            Лента сообщества
          </h2>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setDisplayMode('grid')}
              className={`flex items-center justify-center size-7 rounded-lg transition-colors ${
                displayMode === 'grid'
                  ? 'bg-white/15 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              onClick={() => setDisplayMode('default')}
              className={`flex items-center justify-center size-7 rounded-lg transition-colors ${
                displayMode === 'default'
                  ? 'bg-white/15 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Публикации */}
        <div className="relative space-y-4">
          {allPublications.length === 0 ? (
            <div className="h-screen state-center w-full">
              <ExploreEmpty />
            </div>
          ) : (
            chunks.map((chunk, idx) => {
              if (chunk.type === 'carousel') {
                if (isLoadingRecommended || carouselUsers.length === 0)
                  return null;
                return (
                  <motion.div
                    key={chunk.key}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <RecommendedUsersCarousel users={carouselUsers} />
                  </motion.div>
                );
              }

              return (
                <MasonryGrid
                  key={`posts-chunk-${idx}`}
                  items={chunk.items}
                  mode={displayMode}
                  renderItem={(pub) => (
                    <motion.div
                      key={pub.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <PublicationCard
                        publication={pub}
                        userId={user?.id}
                        displayMode={displayMode}
                      />
                    </motion.div>
                  )}
                />
              );
            })
          )}
        </div>

        {/* Infinite scroll */}
        <div
          ref={observerRef}
          className="h-20 flex items-center justify-center mt-8"
        >
          <AnimatePresence>
            {isFetchingNextPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ExploreLoader />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
