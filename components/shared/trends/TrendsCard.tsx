"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { PublicationImage } from '@/components/shared/publication/PublicationImage';

export const TrendsCard = ({ trend, index }: { trend: any; index: number }) => {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            onClick={() => router.push(`/trends/${trend.id}`)}
            className="relative cursor-pointer group"
        >
            <div className="relative w-full h-full aspect-square rounded-2xl overflow-hidden bg-muted shadow-md">
                <PublicationImage
                    src={trend.trendingCover}
                    alt={trend.coverText || 'trend'}
                    className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

                {/* Cover text */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs sm:text-lg lg:text-xl font-semibold leading-tight line-clamp-3 uppercase">
                        {trend.coverText || trend.content}
                    </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-black/20 transition-colors duration-200 rounded-2xl" />
            </div>
        </motion.div>
    );
};
