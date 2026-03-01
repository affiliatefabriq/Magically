'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Sparkles,
    Loader2,
    Images,
    Copy,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import { useTrend } from '@/hooks/useTrends';
import { getImageUrl } from '@/components/shared/publication/PublicationImage';
import { Button } from '@/components/ui/button';

function ImageGrid({ images }: { images: string[] }) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {images.map((img, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                        onClick={() => setSelectedIdx(i)}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-muted group"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getImageUrl(img)}
                            alt={`image ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedIdx !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedIdx(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative max-w-2xl w-full max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getImageUrl(images[selectedIdx])}
                            alt={`image ${selectedIdx + 1}`}
                            className="w-full h-full object-contain rounded-2xl"
                        />

                        {/* Nav */}
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
                            {selectedIdx > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIdx(selectedIdx - 1);
                                    }}
                                    className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 text-white"
                                >
                                    ‹
                                </button>
                            )}
                            <div className="flex-1" />
                            {selectedIdx < images.length - 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIdx(selectedIdx + 1);
                                    }}
                                    className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 text-white"
                                >
                                    ›
                                </button>
                            )}
                        </div>

                        {/* Counter */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                            {selectedIdx + 1} / {images.length}
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}

export default function TrendDetailPage() {
    const { trendId } = useParams<{ trendId: string }>();
    const router = useRouter();
    const { data: trend, isLoading, isError } = useTrend(trendId);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !trend) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <Sparkles className="w-12 h-12 opacity-20" />
                <p>Тренд не найден</p>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-primary hover:underline"
                >
                    Назад
                </button>
            </div>
        );
    };

    const handleRemix = () => {
        if (!trend.content) return;
        router.push(
            `/create/magic-photo?prompt=${encodeURIComponent(trend.content)}`,
        );
    };

    return (
        <div className="min-h-screen">
            <div className="section-padding py-6 space-y-6 max-w-3xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Назад
                </button>

                {/* Cover */}
                {trend.trendingCover && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative w-full aspect-video sm:aspect-16/7 rounded-2xl overflow-hidden bg-muted"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getImageUrl(trend.trendingCover)}
                            alt={trend.coverText || 'trend'}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                        {trend.coverText && (
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-violet-300" />
                                    <span className="text-violet-300 text-xs font-medium uppercase tracking-widest">
                                        Trending
                                    </span>
                                </div>
                                <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
                                    {trend.coverText}
                                </h1>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Title (if no cover image) */}
                {!trend.trendingCover && trend.coverText && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                    >
                        <Sparkles className="w-5 h-5 text-violet-400 mt-1 shrink-0" />
                        <h1 className="text-2xl font-bold">{trend.coverText}</h1>
                    </motion.div>
                )}

                {/* Content / Prompt */}
                <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="btn-solid rounded-2xl p-2 w-full text-lg"
                    onClick={handleRemix}
                >
                    ✦ Повторить
                </motion.button>

                {/* Image set */}
                {trend.trendingImageSet && trend.trendingImageSet.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">
                                Примеры ({trend.trendingImageSet.length} фото)
                            </p>
                        </div>
                        <ImageGrid images={trend.trendingImageSet} />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
