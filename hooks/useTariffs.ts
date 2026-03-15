'use client';

import { useCallback, useEffect, useState } from 'react';

import api from '@/lib/api';
import { useUser } from '@/hooks/useAuth';
import type {
  CurrentPlanResponse,
  TariffPlan,
  UseTariffsResult,
} from '@/components/tariffs/types';

const YEAR_DAYS_THRESHOLD = 300;

function derivePeriod(plans: TariffPlan[]): 'month' | 'year' {
  if (!plans.length) return 'month';
  const days = plans[0].periodDays ?? 0;
  return days >= YEAR_DAYS_THRESHOLD ? 'year' : 'month';
}

export const useTariffs = (): UseTariffsResult => {
  const { data: user } = useUser();
  const [plans, setPlans] = useState<TariffPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<CurrentPlanResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const plansResponse = await api.get<{ data: { plans: TariffPlan[] } }>(
        '/plans',
        {
          params: { type: 'package' },
        },
      );

      const allPlans = plansResponse.data.data.plans ?? [];
      const visiblePlans = allPlans.filter((plan) => plan.name !== 'Trial');
      setPlans(visiblePlans);

      if (user) {
        try {
          const currentPlanResponse = await api.get<{
            data: CurrentPlanResponse;
          }>('/users/me/plan');
          setCurrentPlan(currentPlanResponse.data.data);
        } catch (planError: any) {
          if (planError?.response?.status !== 401) {
            setError(
              planError?.response?.data?.message ||
                planError.message ||
                'Failed to load current plan.',
            );
          }
          setCurrentPlan(null);
        }
      } else {
        setCurrentPlan(null);
      }
    } catch (e: any) {
      setIsError(true);
      setError(
        e?.response?.data?.message ||
          e?.message ||
          'Failed to load tariffs. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    plans,
    currentPlan,
    period: derivePeriod(plans),
    isLoading,
    isError,
    error,
    refetch: load,
  };
};
