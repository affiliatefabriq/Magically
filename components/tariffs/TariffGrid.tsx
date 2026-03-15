'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useTariffs } from '@/hooks/useTariffs';
import type { TariffPlan } from '@/components/tariffs/types';
import { BeGatewayParams, BeGatewayStatus } from '@/types';
import {
  getDisplayPlans,
  getThemeForPlanIndex,
} from '@/components/tariffs/themes';
import { PeriodToggle } from '@/components/tariffs/PeriodToggle';
import { TariffCard } from '@/components/tariffs/TariffCard';

export const TariffGrid = () => {
  const t = useTranslations('Pages.Tariffs');
  const router = useRouter();
  const pathname = usePathname();
  const {
    plans,
    currentPlan,
    period,
    isLoading,
    isError,
    error: loadError,
    refetch,
  } = useTariffs();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>(() =>
    period === 'year' ? 'year' : 'month',
  );
  const widgetInitialized = useRef(false);

  const displayPlans = getDisplayPlans(plans, selectedPeriod);

  const currentPlanName = currentPlan?.planName ?? null;

  useEffect(() => {
    setSelectedPeriod(period);
  }, [period]);

  const initBePaidWidget = (token: string) => {
    if (!window.BeGateway || widgetInitialized.current) {
      return;
    }

    widgetInitialized.current = true;

    const isWebView =
      typeof window !== 'undefined' &&
      (window as any)?.Telegram?.WebApp !== undefined;

    const isTestMode =
      process.env.NEXT_PUBLIC_BEPAID_TEST === 'true' ||
      process.env.NEXT_PUBLIC_BEPAID_TEST === '1';

    const params = {
      checkout_url: 'https://checkout.bepaid.by',
      fromWebview: isWebView,
      checkout: {
        iframe: true,
        test: isTestMode,
        transaction_type: 'payment' as const,
      },
      token,
      closeWidget: (status: BeGatewayStatus | null) => {
        widgetInitialized.current = false;
        setProcessingPlanId(null);

        if (status === 'successful') {
          setError(null);
          void refetch();
        } else if (status === 'failed' || status === 'error') {
          setError('Платеж не был выполнен. Попробуйте еще раз.');
        } else {
          setError(null);
        }
      },
    } satisfies BeGatewayParams;

    try {
      new window.BeGateway!(params).createWidget();
    } catch {
      setError('Не удалось открыть платежный виджет. Попробуйте еще раз.');
      widgetInitialized.current = false;
      setProcessingPlanId(null);
    }
  };

  const handleSelect = async (plan: TariffPlan) => {
    if (!currentPlan && !processingPlanId) {
      const from = encodeURIComponent(pathname || '/tariffs');
      router.push(`/login?from=${from}`);
      return;
    }

    const hasActivePlan =
      currentPlan?.hasActivePlan && currentPlan.status !== 'noplan';
    const isUpgrade =
      hasActivePlan &&
      (currentPlan.planType === 'package' ||
        currentPlan.planType === 'subscription') &&
      !!currentPlanName &&
      plan.name !== currentPlanName;
    const endpoint = isUpgrade ? '/plans/upgrade' : '/plans/purchase';

    setError(null);
    setProcessingPlanId(plan.id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1${endpoint}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ planId: plan.id }),
        },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body?.message || body?.errors || 'Не удалось создать платеж.';
        throw new Error(message);
      }

      const data = (await response.json()) as {
        data?: { paymentToken?: string };
      };

      const token = data.data?.paymentToken;

      if (!token) {
        throw new Error('Токен платежа не получен');
      }

      if (!isScriptLoaded) {
        const checkScript = setInterval(() => {
          if (window.BeGateway) {
            setIsScriptLoaded(true);
            clearInterval(checkScript);
            initBePaidWidget(token);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkScript);
          if (!window.BeGateway) {
            setError(
              'Не удалось загрузить платежный виджет. Обновите страницу.',
            );
            setProcessingPlanId(null);
          }
        }, 5000);
      } else {
        initBePaidWidget(token);
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          'Не удалось создать платеж. Попробуйте еще раз.',
      );
      setProcessingPlanId(null);
      widgetInitialized.current = false;
    }
  };

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 min-[1360px]:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 h-80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
        <p className="text-sm text-destructive">
          {loadError ?? t('Errors.LoadPlans')}
        </p>
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-muted-foreground">{t('Empty.Plans')}</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.bepaid.by/widget/be_gateway.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
        onError={() => {
          setError(t('Errors.WidgetLoad'));
        }}
      />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <PeriodToggle value={selectedPeriod} onChange={setSelectedPeriod} />

      <div className="grid grid-cols-1 gap-6 min-[1360px]:grid-cols-3 justify-items-center">
        {displayPlans.slice(0, 9).map((plan, index) => (
          <TariffCard
            key={plan.id}
            plan={plan}
            index={index}
            theme={getThemeForPlanIndex(index)}
            selectedPeriod={selectedPeriod}
            isCurrent={!!currentPlanName && plan.name === currentPlanName}
            isProcessing={processingPlanId === plan.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </>
  );
};
