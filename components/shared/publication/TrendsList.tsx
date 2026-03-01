'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTrendsPreview } from '@/hooks/useTrends';
import { PublicationImage } from '@/components/shared/publication/PublicationImage';

export const TrendCard = ({ trend, index }: { trend: any; index: number }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => router.push(`/trends/${trend.id}`)}
      className="relative shrink-0 w-36 sm:w-44 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-muted shadow-md">
        <PublicationImage
          src={trend.trendingCover}
          alt={trend.coverText || 'trend'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        {/* Cover text */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-white text-xs font-semibold leading-tight line-clamp-3">
            {trend.coverText || trend.content}
          </p>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/10 transition-colors duration-200 rounded-2xl" />
      </div>
    </motion.div>
  );
};

export const TrendCardSkeleton = () => {
  return (
    <div className="shrink-0 w-36 sm:w-44">
      <div className="w-full aspect-3/4 rounded-2xl bg-muted animate-pulse" />
      <div className="mt-1.5 h-3 bg-muted animate-pulse rounded w-12" />
    </div>
  );
};

export const TrendsList = () => {
  const { data: trends, isLoading } = useTrendsPreview(8);

  if (!isLoading && (!trends || trends.length === 0)) return null;

  return (
    <section className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm tracking-wide">Тренды</h2>
        </div>
        <Link
          href="/trends"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Все тренды
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <TrendCardSkeleton key={i} />
            ))
          : trends?.map((trend, i) => (
              <div key={trend.id} className="snap-start">
                <TrendCard trend={trend} index={i} />
              </div>
            ))}
      </div>
    </section>
  );
};
