'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { CurrentPlan } from '@/components/tariffs/CurrentPlan';
import { TariffGrid } from '@/components/tariffs/TariffGrid';
import { EnergyTopUp } from '@/components/tariffs/EnergyTopUp';

export const Tariffs = () => {
  const t = useTranslations('Pages.Tariffs');

  return (
    <div className="section-padding space-y-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src="/assets/logo.jpg"
            alt=""
            width={64}
            height={64}
            className="rounded-[16px] object-cover"
          />
          <div className="space-y-2">
            <h1 className="title-text">{t('Title')}</h1>
            <p className="text-muted-foreground max-w-[209px] mx-auto">
              {t('Subtitle')}
            </p>
          </div>
        </div>

        <CurrentPlan />
      </div>

      <div className="max-w-6xl mx-auto">
        <TariffGrid />
      </div>

      <EnergyTopUp />
    </div>
  );
};
