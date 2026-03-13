'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useTrends } from '@/hooks/useTrends';
import { AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { BackButton } from '@/components/shared/layout/BackButton';
import { TrendsCard } from '@/components/shared/trends/TrendsCard';
import { TrendsCardLoader } from '@/components/states/Loaders';

export const Trends = () => {
    const t = useTranslations("Pages.Trends");
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useTrends();
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
            <div className="section-padding py-6 space-y-3">
                {/* Header */}
                <BackButton />
                <h1 className="title-text mt-8 md:mt-4">{t("Title")}</h1>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <TrendsCardLoader key={i} />
                        ))}
                    </div>
                ) : allTrends.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                        <Sparkles className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm">{t("NoTrends")}</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {allTrends.map((trend: any, i: number) => (
                                <TrendsCard key={trend.id} trend={trend} index={i} />
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
};