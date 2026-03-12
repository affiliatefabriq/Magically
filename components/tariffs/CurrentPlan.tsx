'use client';

import { useEffect, useState } from 'react';

import api from '@/lib/api';
import { useUser } from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';
import type {
  CurrentPlanResponse,
  UserPlanStatus,
} from '@/components/tariffs/types';

const statusLabel: Record<UserPlanStatus, string> = {
  trial: 'trial',
  active: 'active',
  overdue: 'overdue',
  cancelled: 'cancelled',
  expired: 'expired',
  noplan: 'noplan',
};

export const CurrentPlan = () => {
  const t = useTranslations('Pages.Tariffs');
  const { data: user, isLoading: isUserLoading } = useUser();
  const [data, setData] = useState<CurrentPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

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
      <div className="rounded-2xl border border-border/60 bg-background/60 p-6 min-h-35 animate-pulse" />
    );
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-background/60 p-6 min-h-35 animate-pulse" />
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
        <p className="text-sm text-destructive">
          {t('Errors.LoadCurrentPlan')}
        </p>
      </div>
    );
  }

  if (!data || !data.hasActivePlan || data.status === 'noplan') {
    return (
      <div className="rounded-2xl border border-border/60 bg-background/60 p-6">
        <h2 className="text-lg font-semibold tracking-tight mb-1">
          {t('NoPlan.Title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('NoPlan.Description')}
        </p>
      </div>
    );
  }

  const totalTokens = data.tokensFromPlan + data.tokensFromTopup;

  return (
    <div className="rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-background to-background p-6 shadow-md backdrop-blur-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
            {t('CurrentPlan.Title')}
          </p>
          <h2 className="text-xl font-semibold tracking-tight">
            {data.planName ?? t('CurrentPlan.NoName')}
          </h2>
        </div>
        <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
          {t(`CurrentPlan.Status.${statusLabel[data.status]}`)}
        </span>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground text-[11px] uppercase tracking-wide">
            {t('CurrentPlan.Tokens')}
          </p>
          <p className="text-lg font-semibold">
            {totalTokens}
            <span className="ml-2 rounded-full bg-background/60 px-2 py-0.5 text-[11px] font-normal text-muted-foreground">
              {t('CurrentPlan.TokensBreakdown', {
                fromPlan: data.tokensFromPlan,
                fromTopup: data.tokensFromTopup,
              })}
            </span>
          </p>
        </div>

        {data.endDate && (
          <div className="space-y-1">
            <p className="text-muted-foreground text-[11px] uppercase tracking-wide">
              {t('CurrentPlan.EndDate')}
            </p>
            <p className="inline-flex items-center rounded-full bg-background/60 px-3 py-1 text-xs font-medium">
              {new Date(data.endDate).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
