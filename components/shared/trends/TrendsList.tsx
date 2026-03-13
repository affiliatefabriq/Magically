'use client';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';
import { TrendsCard } from './TrendsCard';
import { useTranslations } from 'next-intl';
import { useTrendsPreview } from '@/hooks/useTrends';
import { TrendsCardLoader } from '@/components/states/Loaders';

export const TrendsList = () => {
  const t = useTranslations("Pages.Trends");
  const { data: trends, isLoading } = useTrendsPreview(9);

  if (!isLoading && (!trends || trends.length === 0)) return null;

  return (
    <section className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="font-semibold text-sm tracking-wide">{t("Title")}</h2>
        <Link
          href="/trends"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {t("AllTrends")}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Tile grid: 2 cols mobile, 3 cols tablet+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <TrendsCardLoader key={i} />
          ))
          : trends?.slice(0, 6).map((trend, i) => (
            <TrendsCard key={trend.id} trend={trend} index={i} />
          ))}
      </div>
    </section>
  );
};
