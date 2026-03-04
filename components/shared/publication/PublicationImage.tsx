'use client';

import Image from 'next/image';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { API_URL, BUCKET_NAME, S3, S3_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

type PublicationImageProps = {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
};

export const getImageUrl = (src: string) => {
  if (!src) return 'no src';

  if (S3 === 'true') {
    const path = `${S3_URL}/${BUCKET_NAME}/${src}`;
    return path;
  }

  if (src.startsWith('http://localhost')) {
    return src;
  }

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  const fullUrl = `${API_URL}/${src}`;
  console.log(fullUrl);
  return fullUrl;
};

// Shimmer gradient placeholder as base64 SVG
const shimmerSvg = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#1a1a1a" offset="20%" />
      <stop stop-color="#2a2a2a" offset="50%" />
      <stop stop-color="#1a1a1a" offset="70%" />
    </linearGradient>
    <linearGradient id="gLight">
      <stop stop-color="#e8e8e8" offset="20%" />
      <stop stop-color="#f5f5f5" offset="50%" />
      <stop stop-color="#e8e8e8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(unescape(encodeURIComponent(str)));

const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmerSvg(400, 400))}`;

export const PublicationImage = ({
  src,
  alt,
  className,
  onClick,
}: PublicationImageProps) => {
  const t = useTranslations('Components.Publication');
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 text-muted-foreground aspect-square rounded-xl theme-2">
        <ImageIcon className="size-6 sm:size-12" />
        <span className="text-xs sm:text-base">{t('noImage')}</span>
      </div>
    );
  }

  const finalImageUrl = getImageUrl(src);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* Shimmer overlay while loading */}
      {!loaded && (
        <div className="absolute inset-0 z-10 overflow-hidden rounded-xl">
          <div className="w-full h-full bg-muted/60 animate-shimmer bg-linear-to-r from-muted/60 via-muted/30 to-muted/60 bg-size-[400%_100%]" />
        </div>
      )}
      <Image
        src={finalImageUrl!}
        width={800}
        height={800}
        alt={alt}
        loading="lazy"
        placeholder="blur"
        blurDataURL={blurDataURL}
        quality={75}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={cn(
          'rounded-xl w-full h-auto transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        onClick={onClick}
      />
    </div>
  );
};

export const ModelImage = ({ src, alt, className }: PublicationImageProps) => {
  const t = useTranslations('Components.Publication');
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 text-muted-foreground aspect-square rounded-xl theme-2">
        <ImageIcon className="size-12" />
        <span>{t('noImage')}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-square">
      {!loaded && (
        <div className="absolute inset-0 z-10 rounded-xl bg-muted/60 animate-shimmer bg-linear-to-r from-muted/60 via-muted/30 to-muted/60 bg-size-[400%_100%]" />
      )}
      <Image
        src={src}
        width={800}
        height={800}
        alt={alt}
        loading="lazy"
        placeholder="blur"
        blurDataURL={blurDataURL}
        quality={75}
        sizes="(max-width: 640px) 100vw, 50vw"
        className={cn(
          'rounded-xl object-cover aspect-square w-full transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
};
