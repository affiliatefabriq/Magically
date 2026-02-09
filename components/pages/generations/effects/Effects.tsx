import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Icon } from '@/components/ui/magic/everhault-card';

export const Effects = () => {
  const t = useTranslations('Pages.Effects');

  return (
    <section className="flex flex-col flex-wrap container mx-auto max-w-6xl px-3">
      <h1 className="title-text mt-4">{t('title')}</h1>
      <div className="grid-3 gap-4 mt-6">
        <Link
          href="/create/photo-effects/generate"
          className="border border-black/20 dark:border-white/20 flex flex-col items-start w-full p-2 relative"
        >
          <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
          <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
          <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
          <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

          <video
            width="1024"
            height="1024"
            autoPlay
            loop
            preload="metadata"
            className="rounded-xl"
          >
            <source src="/effects/1.mp4" />
          </video>

          <div className="p-2 font-mono">
            <h1 className="text-xl font-bold">{t('PhotoGenerate.title')}</h1>
            <p className="font-thin text-xs mt-4 space-y-1">
              {t('PhotoGenerate.description')}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
};
