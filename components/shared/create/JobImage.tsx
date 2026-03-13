'use client';

import { PublicationImage } from '../publication/PublicationImage';
import { AlertTriangle, LoaderCircle, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useRetryAIJob } from '@/hooks/useAi';

type Props = {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imageUrl?: string | null;
  alt?: string;
  error?: string;
  onClick?: () => void;
  className?: string;
};

export function JobImage({
  jobId,
  status,
  imageUrl,
  alt,
  error,
  onClick,
  className,
}: Props) {
  const t = useTranslations("Pages.Job");
  const { mutate: retryJob, isPending: isRetrying } = useRetryAIJob();

  if (status === 'completed' && imageUrl) {
    return (
      <PublicationImage
        src={imageUrl}
        alt={alt || 'result'}
        className={`${className} rounded-xl object-cover aspect-square`}
        onClick={onClick}
      />
    );
  }

  if (status === 'failed') {
    return (
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-linear-to-br from-red-950 to-black flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.15),transparent_70%)]" />
        <div className="z-10 flex flex-col items-center gap-3 text-red-400">
          <AlertTriangle size={40} />
          <span className="text-center text-sm opacity-80">{t("Status.Fail")}</span>
          <Button
            onClick={() => retryJob(jobId)}
            disabled={isRetrying}
            className="rounded-full btn-error mt-2"
          >
            {isRetrying ? <LoaderCircle className="animate-spin" /> : null}
            {isRetrying ? t('Retrying') : t('Retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-fuchsia-800 via-green-700 to-teal-800 animate-gradient" />
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="text-white animate-pulse text-xl" size={40} />
      </div>
    </div>
  );
}