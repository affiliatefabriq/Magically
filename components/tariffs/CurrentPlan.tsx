'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import api from '@/lib/api';
import { useUser } from '@/hooks/useAuth';
import { useTariffs } from '@/hooks/useTariffs';
import { useTranslations } from 'next-intl';
import type { CurrentPlanResponse } from '@/components/tariffs/types';
import {
  getDisplayPlans,
  getThemeForPlanIndex,
} from '@/components/tariffs/themes';
import { USER_PLAN_STATUS_LABELS } from '@/components/tariffs/status';

export const CurrentPlan = () => {
  const t = useTranslations('Pages.Tariffs');
  const { data: user, isLoading: isUserLoading } = useUser();
  const { plans, period } = useTariffs();
  const [data, setData] = useState<CurrentPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const displayPlans = getDisplayPlans(plans, period);
  const planIndex =
    data?.planName != null
      ? displayPlans.findIndex((p) => p.name === data.planName)
      : -1;
  const theme =
    planIndex >= 0 ? getThemeForPlanIndex(planIndex) : getThemeForPlanIndex(0);

  useEffect(() => {
    if (!user) {
      setData(null);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    const fetchCurrentPlan = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const response = await api.get<{ data: CurrentPlanResponse }>(
          '/users/me/plan',
        );
        setData(response.data.data);
      } catch (e: any) {
        console.error('Failed to fetch current plan:', e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentPlan();
  }, [user]);

  if (isUserLoading) {
    return (
      <div
        className="rounded-2xl border border-white/10 p-6 min-h-[120px] animate-pulse"
        style={{ backgroundColor: '#0A0A0A' }}
      />
    );
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        className="rounded-2xl border border-white/10 p-6 min-h-[120px] animate-pulse"
        style={{ backgroundColor: '#0A0A0A' }}
      />
    );
  }

  if (isError) {
    return (
      <div
        className="rounded-2xl border border-white/10 p-6"
        style={{ backgroundColor: '#0A0A0A' }}
      >
        <p className="text-sm text-destructive">
          {t('Errors.LoadCurrentPlan')}
        </p>
      </div>
    );
  }

  if (!data || !data.hasActivePlan || data.status === 'noplan') {
    return (
      <div
        className="rounded-2xl border border-white/10 p-6"
        style={{ backgroundColor: '#0A0A0A' }}
      >
        <h2 className="text-[18px] font-bold tracking-tight mb-1 text-white">
          {t('NoPlan.Title')}
        </h2>
        <p className="text-[13px] text-muted-foreground">
          {t('NoPlan.Description')}
        </p>
      </div>
    );
  }

  if (data.planName !== 'Trial') {
    return null;
  }

  const totalTokens = data.tokensFromPlan + data.tokensFromTopup;

  return (
    <div
      className="rounded-2xl border border-white/10 p-6 transition-all duration-200"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2
              className={`text-[24px] font-bold tracking-tight ${theme.gradient} bg-clip-text text-transparent`}
            >
              {(data.planName ?? '').replace(' (год)', '').trim() ||
                t('CurrentPlan.NoName')}
            </h2>
            <Image
              src={theme.flask}
              alt=""
              width={28}
              height={28}
              className="shrink-0"
            />
          </div>
          <span className="inline-flex items-center rounded-[10px] border border-white/25 bg-[#1A1A1A] px-3 py-1.5 text-[11px] font-medium text-white/90">
            {t(`CurrentPlan.Status.${USER_PLAN_STATUS_LABELS[data.status]}`)}
          </span>
        </div>
        <div className="flex items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {t('CurrentPlan.Tokens')}
            </span>
            <span className="font-semibold text-white">{totalTokens}</span>
            <span className="text-[11px] text-muted-foreground">
              {t('CurrentPlan.TokensBreakdown', {
                fromPlan: data.tokensFromPlan,
                fromTopup: data.tokensFromTopup,
              })}
            </span>
          </div>
          {data.endDate && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {t('CurrentPlan.EndDate')}
              </span>
              <span className="text-white/90">
                {new Date(data.endDate).toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        {t('CurrentPlan.Title')}
      </p>
    </div>
  );
};
