"use client"

import { DisplayMode } from '@/types';
import { useEffect, useState, useMemo } from 'react';

const CAROUSEL_INTERVAL = 50;

export function getColumnCount(mode: DisplayMode): number {
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

export function useColumnCount(mode: DisplayMode) {
    const [cols, setCols] = useState(() => getColumnCount(mode));
    useEffect(() => {
        const handler = () => setCols(getColumnCount(mode));
        const ro = new ResizeObserver(handler);
        ro.observe(document.documentElement);
        return () => ro.disconnect();
    }, [mode]);
    return cols;
}

export function distributeToColumns<T>(items: T[], colCount: number): T[][] {
    const columns: T[][] = Array.from({ length: colCount }, () => []);
    items.forEach((item, i) => columns[i % colCount].push(item));
    return columns;
}

export const MasonryGrid = ({
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

export const buildChunks = (publications: any[]) => {
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
};