'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { formatPriceCurrencyFirst } from '@/lib/currency';

import type { TariffPlan } from '@/components/tariffs/types';
import { getTaglineKeys, TARIFF_THEMES } from '@/components/tariffs/themes';
import { IMAGE_COST, VIDEO_COST, EFFECT_COST } from '@/components/tariffs/constants';

type TariffTheme = (typeof TARIFF_THEMES)[number];
type TariffPeriod = 'month' | 'year';

type TariffCardProps = {
  plan: TariffPlan;
  index: number;
  theme: TariffTheme;
  selectedPeriod: TariffPeriod;
  isCurrent: boolean;
  isProcessing: boolean;
  onSelect: (plan: TariffPlan) => void;
};

export const TariffCard = ({
  plan,
  index,
  theme,
  selectedPeriod,
  isCurrent,
  isProcessing,
  onSelect,
}: TariffCardProps) => {
  const t = useTranslations('Pages.Tariffs');
  const photos = Math.floor(plan.tokenAmount / IMAGE_COST);
  const effects = Math.floor(plan.tokenAmount / EFFECT_COST);
  const videos = Math.floor(plan.tokenAmount / VIDEO_COST);
  const { line1: taglineLine1Key, line2: taglineLine2Key } =
    getTaglineKeys(index);
  const isOdd = index % 2 === 0;
  const cardBg = isOdd ? '#0A0A0A' : '#1A1A1A';

  return (
    <div
      className="flex flex-col rounded-2xl border border-white/10 p-6 transition-all duration-200 hover:border-white/20 w-[360px] min-h-[560px] shrink-0"
      style={{ backgroundColor: cardBg }}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3
          className={`text-[26px] md:text-[30px] font-bold tracking-tight ${theme.gradient} bg-clip-text text-transparent shrink-0`}
        >
          {plan.name.replace(' (год)', '')}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <Image
            src={theme.flask}
            alt=""
            width={28}
            height={28}
            className="shrink-0 w-5 h-5 md:w-7 md:h-7"
          />
          <span className="text-[11px] md:text-[14px] font-medium text-white">
            {t('EnergyBonus', { count: theme.energyBonus })}
          </span>
        </div>
      </div>

      <p className="mb-3 flex items-baseline gap-2">
        <span className="text-[38px] md:text-[48px] font-bold text-white">
          {formatPriceCurrencyFirst(
            plan.priceInUserCurrency ?? plan.price,
            plan.userCurrency ?? plan.currency,
          )}
        </span>
        <span className="text-[16px] md:text-sm text-muted-foreground">
          {selectedPeriod === 'year' ? t('PerYear') : t('PerMonth')}
        </span>
      </p>

      <Button
        type="button"
        className={`w-full rounded-[10px] font-semibold mb-[34px] ${theme.buttonClass}`}
        disabled={isProcessing || isCurrent}
        onClick={() => !isCurrent && onSelect(plan)}
      >
        {isCurrent
          ? t('Plan.ButtonCurrent')
          : isProcessing
            ? t('Plan.ButtonProcessing')
            : t('ButtonActivate')}
      </Button>

      <ul className="flex-1 border-t border-white/10 pt-[27px]">
        <li className="flex items-center gap-2 pb-[14px] text-[10px] md:text-[11px] text-white">
          <Image src={theme.point} alt="" width={14} height={14} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 shrink-0" />
          {t('PlanPhotoCount', { count: photos })}
        </li>
        <li className="flex items-center gap-2 pb-[14px] text-[10px] md:text-[11px] text-muted-foreground">
          <Image src={theme.point} alt="" width={14} height={14} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 shrink-0" />
          {t('PlanEffectsCount', { count: effects })}
        </li>
        <li className="flex items-center gap-2 pb-[14px] text-[10px] md:text-[11px] text-muted-foreground border-b border-white/10">
          <Image src={theme.point} alt="" width={14} height={14} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 shrink-0" />
          {t('PlanVideoCount', { count: videos })}
        </li>
        <li className="flex items-center gap-2 pt-[14px] pb-[14px] text-[10px] md:text-[11px] text-muted-foreground">
          <Image src={theme.point} alt="" width={14} height={14} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 shrink-0" />
          {t('PlanFeatureClub')}
        </li>
        <li className="flex items-center gap-2 text-[10px] md:text-[11px] text-muted-foreground">
          <Image src={theme.point} alt="" width={14} height={14} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 shrink-0" />
          {t('PlanFeatureAutoImage')}
        </li>
      </ul>

      <div className="mt-[16px] md:mt-[26px] text-center flex flex-col items-center gap-0.5">
        <span
          className={`text-[16px] md:text-[18px] font-bold ${theme.gradient} bg-clip-text text-transparent`}
        >
          {t(taglineLine1Key)}
        </span>
        <span className="text-[11px] md:text-[13px] text-muted-foreground">
          {t(taglineLine2Key)}
        </span>
      </div>
    </div>
  );
};
