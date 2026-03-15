'use client';

import { useCallback, useEffect, useState } from 'react';

import api from '@/lib/api';
import { useUser } from '@/hooks/useAuth';
import type { TariffPlan } from '@/components/tariffs/types';

export function useTopupPlans() {
  const { data: user } = useUser();
  const [plans, setPlans] = useState<TariffPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await api.get<{ data: { plans: TariffPlan[] } }>(
        '/plans',
        { params: { type: 'topup' } },
      );
      setPlans(response.data.data.plans ?? []);
    } catch {
      setIsError(true);
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { plans, isLoading, isError, refetch: load };
}
