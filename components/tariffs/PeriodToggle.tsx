'use client';

import { useTranslations } from 'next-intl';

type TariffPeriod = 'month' | 'year';

type PeriodToggleProps = {
  value: TariffPeriod;
  onChange: (period: TariffPeriod) => void;
};

export const PeriodToggle = ({ value, onChange }: PeriodToggleProps) => {
  const t = useTranslations('Pages.Tariffs');
  const activeClass =
    'bg-linear-to-r from-[#AAFF00] to-[#268660] text-black shadow-sm';
  const inactiveClass = 'bg-transparent text-muted-foreground hover:bg-white/5';

  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex gap-1 rounded-[10px] border border-white/25 bg-[#1A1A1A] p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onChange('month')}
          className={`rounded-[10px] px-5 py-2 text-sm font-medium transition-colors ${
            value === 'month' ? activeClass : inactiveClass
          }`}
        >
          {t('PeriodMonth')}
        </button>
        <button
          type="button"
          onClick={() => onChange('year')}
          className={`rounded-[10px] px-5 py-2 text-sm font-medium transition-colors ${
            value === 'year' ? activeClass : inactiveClass
          }`}
        >
          {t('PeriodYear')}
        </button>
      </div>
    </div>
  );
};
