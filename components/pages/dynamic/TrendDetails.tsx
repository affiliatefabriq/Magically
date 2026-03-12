'use client';

import { useRouter } from 'next/navigation';
import { animate, motion, useMotionValue } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Loader2,
    XIcon,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useTrend } from '@/hooks/useTrends';
import { getImageUrl, PublicationImage } from '@/components/shared/publication/PublicationImage';
import { useTranslations } from 'next-intl';

const ImageGrid = ({ images }: { images: string[] }) => {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const swipeThreshold = 80;
    const gap = 48;
    const x = useMotionValue(0);
    const [slideWidth, setSlideWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => {
            if (viewportRef.current) {
                setSlideWidth(viewportRef.current.clientWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => window.removeEventListener('resize', updateWidth);
    }, [selectedIdx]);

    useEffect(() => {
        if (slideWidth > 0) {
            const step = slideWidth + gap;
            x.set(-step);
        }
    }, [selectedIdx, slideWidth]);

    const handleDragEnd = async (_: any, info: any) => {
        if (slideWidth === 0) return;

        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const step = slideWidth + gap;

        if ((offset < -swipeThreshold || velocity < -600) && selectedIdx! < images.length - 1) {
            await animate(x, -step * 2, {
                type: "spring",
                stiffness: 260,
                damping: 30
            });
            setSelectedIdx((i) => i! + 1);
        } else if ((offset > swipeThreshold || velocity > 600) && selectedIdx! > 0) {
            await animate(x, 0, {
                type: "spring",
                stiffness: 260,
                damping: 30
            });
            setSelectedIdx((i) => i! - 1);
        } else {
            animate(x, -step, {
                type: "spring",
                stiffness: 260,
                damping: 30
            });
        }
    };

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
                        <img
                            src={getImageUrl(img)}
                            alt={`image ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </motion.div>
                ))}
            </div>

            {selectedIdx !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedIdx(null)}
                >
                    <motion.div
                        ref={viewportRef}
                        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            className="flex gap-12"
                            style={{ x }}
                            drag="x"
                            dragConstraints={{
                                left: slideWidth > 0 ? -(slideWidth + gap) * 2 : 0,
                                right: 0
                            }}
                            onDragEnd={handleDragEnd}
                        >
                            {/* Предыдущая */}
                            <div className="w-full shrink-0 flex justify-center">
                                {selectedIdx > 0 && (
                                    <PublicationImage
                                        src={images[selectedIdx - 1]}
                                        className="object-contain max-h-[85vh]"
                                        alt=""
                                    />
                                )}
                            </div>

                            {/* Текущая */}
                            <div className="w-full shrink-0 flex justify-center">
                                <PublicationImage
                                    src={images[selectedIdx]}
                                    className="object-contain max-h-[85vh]"
                                    alt=""
                                />
                            </div>

                            {/* Следующая */}
                            <div className="w-full shrink-0 flex justify-center">
                                {selectedIdx < images.length - 1 && (
                                    <PublicationImage
                                        src={images[selectedIdx + 1]}
                                        className="object-contain max-h-[85vh]"
                                        alt=""
                                    />
                                )}
                            </div>
                        </motion.div>

                        <button
                            onClick={() => setSelectedIdx(null)}
                            className="absolute top-3 right-3 p-1 rounded-full bg-black/60 backdrop-blur-2xl hover:bg-black/80 text-white"
                        >
                            <XIcon className="size-4" />
                        </button>

                        {/* Nav */}
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
                            {selectedIdx > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIdx(selectedIdx - 1);
                                    }}
                                    className="pointer-events-auto p-2 rounded-full bg-black/60 backdrop-blur-2xl hover:bg-black/80 text-white"
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
                                    className="pointer-events-auto p-2 rounded-full bg-black/60 backdrop-blur-2xl hover:bg-black/80 text-white"
                                >
                                    ›
                                </button>
                            )}
                        </div>

                        {/* Counter */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-2xl text-white text-xs px-3 py-1 rounded-full">
                            {selectedIdx + 1} / {images.length}
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export const TrendDetails = ({ trendId }: { trendId: string }) => {
    const t = useTranslations("Pages.Trends.Details");
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
                <p>{t("NotFound")}</p>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-primary hover:underline"
                >
                    {t("Back")}
                </button>
            </div>
        );
    }

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
                    {t("Back")}
                </button>

                {/* Cover */}
                {trend.trendingCover && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative w-full aspect-video sm:aspect-16/7 rounded-2xl overflow-hidden bg-muted"
                    >
                        <PublicationImage
                            src={trend.trendingCover}
                            alt={trend.coverText || 'trend'}
                            className="w-full h-full object-cover aspect-video"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                        {trend.coverText && (
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-violet-300" />
                                    <span className="text-violet-300 text-xs font-medium uppercase tracking-widest">
                                        {t("Trending")}

                                    </span>
                                </div>
                                <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
                                    {trend.coverText}
                                </h1>
                            </div>
                        )}
                    </motion.div>
                )}

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

                <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="btn-solid rounded-lg p-1 w-full text-base font-semibold"
                    onClick={handleRemix}
                >
                    ✦ {t("DoTheSame")}
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
                                {t("Example")} ({trend.trendingImageSet.length} {t("Images")})
                            </p>
                        </div>
                        <ImageGrid images={trend.trendingImageSet} />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
