import { useTranslations } from 'next-intl';

import { CurrentPlan } from '@/components/tariffs/CurrentPlan';
import { TariffGrid } from '@/components/tariffs/TariffGrid';

export const Tariffs = () => {
  const t = useTranslations('Pages.Tariffs');

  return (
    <div className="section-padding space-y-10 pb-24">
      <div className="mx-auto max-w-6xl space-y-3">
        <div>
          <h1 className="title-text mt-4">{t('Title')}</h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">{t('Subtitle')}</p>
        </div>
        <CurrentPlan />
      </div>

      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            {t('AvailablePackages')}
          </h2>
        </div>

        <TariffGrid />
      </div>
    </div>
  );
};
