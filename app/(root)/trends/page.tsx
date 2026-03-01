'use client';

import { useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { useTrends } from '@/hooks/useTrends';
import { PublicationImage } from '@/components/shared/publication/PublicationImage';
import { BackButton } from '@/components/shared/layout/BackButton';

function TrendCard({ trend, index }: { trend: any; index: number }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index % 20) * 0.04 }}
      onClick={() => router.push(`/trends/${trend.id}`)}
      className="relative cursor-pointer group rounded-2xl overflow-hidden bg-card border border-border hover:border-violet-500/50 transition-all duration-200 shadow-sm hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        <PublicationImage
          src={trend.trendingCover}
          alt={trend.coverText || 'trend'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-transparent" />

        {/* Cover text */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white text-sm font-semibold leading-snug line-clamp-3">
            {trend.coverText || trend.content}
          </p>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/8 transition-colors duration-200" />
      </div>
    </motion.div>
  );
}

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-card border border-border">
    <div className="aspect-3/4 bg-muted animate-pulse" />
  </div>
);

export default function TrendsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTrends();
  const router = useRouter();

  const allTrends = data?.pages.flatMap((page) => page.trends) ?? [];

  const setObserverRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.5 },
      );
      observer.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  return (
    <div className="min-h-screen">
      <div className="section-padding py-6 space-y-6">
        {/* Header */}
        <BackButton />

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8 md:mt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : allTrends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground mt-8 md:mt-4">
            <Sparkles className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">Трендов пока нет</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8 md:mt-4">
              {allTrends.map((trend: any, i: number) => (
                <TrendCard key={trend.id} trend={trend} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Infinite scroll trigger */}
        <div
          ref={setObserverRef}
          className="h-16 flex items-center justify-center"
        >
          {isFetchingNextPage && (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}
