import Image from 'next/image';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { API_URL, BUCKET_NAME, S3, S3_URL } from '@/lib/api';

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

  const fullUrl = `${API_URL}${src}`;
  console.log(fullUrl);
  return fullUrl;
};

export const PublicationImage = ({
  src,
  alt,
  className,
  onClick,
}: PublicationImageProps) => {
  const t = useTranslations('Components.Publication');
  const [error, setError] = useState(false);

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
    <Image
      src={finalImageUrl!}
      width={1024}
      height={1024}
      alt={alt}
      className={`rounded-xl object-cover aspect-square w-full ${className}`}
      onError={() => setError(true)}
      onClick={onClick}
    />
  );
};

export const ModelImage = ({ src, alt, className }: PublicationImageProps) => {
  const t = useTranslations('Components.Publication');
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 text-muted-foreground aspect-square rounded-xl theme-2">
        <ImageIcon className="size-12" />
        <span>{t('noImage')}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      width={1024}
      height={1024}
      alt={alt}
      className={`rounded-xl object-cover aspect-square w-full ${className}`}
      onError={() => setError(true)}
    />
  );
};
