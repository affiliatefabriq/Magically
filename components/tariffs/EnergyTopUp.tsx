'use client';

import { useRef, useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { formatPriceCurrencyFirst } from '@/lib/currency';

import { useTopupPlans } from '@/hooks/useTopupPlans';
import type { TariffPlan } from '@/components/tariffs/types';
import { BeGatewayParams, BeGatewayStatus } from '@/types';
import {
  IMAGE_COST,
  VIDEO_COST,
  TOPUP_BASE_AMOUNT,
  TOPUP_STEP,
  TOPUP_MAX_AMOUNT,
} from '@/components/tariffs/constants';

export const EnergyTopUp = () => {
  const t = useTranslations('Pages.Tariffs');
  const { plans, isLoading, isError, refetch } = useTopupPlans();
  const [amount, setAmount] = useState(TOPUP_BASE_AMOUNT);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const widgetInitialized = useRef(false);

  const initBePaidWidget = (token: string) => {
    if (!window.BeGateway || widgetInitialized.current) return;
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
      setError('Не удалось открыть платежный виджет.');
      widgetInitialized.current = false;
      setProcessingPlanId(null);
    }
  };

  const handleTopUp = async (plan: TariffPlan) => {
    setError(null);
    setProcessingPlanId(plan.id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/plans/topup`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: plan.id, amount }),
        },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const msg =
          body?.message || body?.errors || 'Не удалось создать платеж.';
        throw new Error(msg);
      }

      const data = (await response.json()) as {
        data?: { paymentToken?: string };
      };
      const token = data.data?.paymentToken;

      if (!token) throw new Error('Токен платежа не получен');

      if (!isScriptLoaded) {
        const id = setInterval(() => {
          if (window.BeGateway) {
            setIsScriptLoaded(true);
            clearInterval(id);
            initBePaidWidget(token);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(id);
          if (!window.BeGateway) {
            setError('Не удалось загрузить платежный виджет.');
            setProcessingPlanId(null);
          }
        }, 5000);
      } else {
        initBePaidWidget(token);
      }
    } catch (e: any) {
      setError(e?.message || 'Не удалось создать платеж.');
      setProcessingPlanId(null);
      widgetInitialized.current = false;
    }
  };

  if (isLoading || isError || !plans.length) {
    return null;
  }

  const plan = plans[0];
  const baseTokens = plan.tokenAmount || TOPUP_BASE_AMOUNT;
  const basePrice = plan.priceInUserCurrency ?? plan.price;
  const totalPrice = Math.round(Number(basePrice) * (amount / baseTokens));
  const photos = Math.floor(amount / IMAGE_COST);
  const videos = Math.floor(amount / VIDEO_COST);

  return (
    <>
      <Script
        src="https://js.bepaid.by/widget/be_gateway.js"
        strategy="lazyOnload"
        onLoad={() => setIsScriptLoaded(true)}
      />

      <div className="max-w-6xl mx-auto mt-12">
        <div className="text-center space-y-2">
          <h2 className="text-[24px] font-bold tracking-tight text-foreground">
            {t('EnergySectionTitle')}
          </h2>
          <p className="text-[13px] text-muted-foreground max-w-[406px] mx-auto">
            {t('EnergySectionDescription')}
          </p>
        </div>

        <div className="flex flex-col items-center mt-[150px]">
          <div className="relative w-full max-w-[360px]">
            <Image
              src="/assets/flask_purple.svg"
              alt=""
              width={211}
              height={211}
              className="absolute left-1/2 -translate-x-1/2 z-10 w-[140px] h-[140px] md:w-[211px] md:h-[211px] -top-[70px] md:-top-[105.5px]"
            />
            <div
              className="rounded-2xl border border-white/10 px-6 pb-6 pt-[70px] md:pt-[106px] w-full"
              style={{ backgroundColor: '#0A0A0A' }}
            >
              {error && (
                <p className="mb-4 text-sm text-destructive">{error}</p>
              )}

              <div className="flex items-center justify-center gap-4 mb-3 flex-nowrap">
                <button
                  type="button"
                  onClick={() =>
                    setAmount((a) =>
                      a > TOPUP_BASE_AMOUNT ? a - TOPUP_STEP : a,
                    )
                  }
                  className="flex size-[27px] shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors text-base font-medium disabled:opacity-50"
                  disabled={amount <= TOPUP_BASE_AMOUNT}
                  aria-label="-"
                >
                  −
                </button>
                <p className="text-[26px] md:text-[32px] font-bold bg-linear-to-r from-[#B812CA] to-[#4B44D6] bg-clip-text text-transparent text-center whitespace-nowrap shrink-0">
                  {t('EnergyAmount', { count: amount })}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setAmount((a) =>
                      a < TOPUP_MAX_AMOUNT ? a + TOPUP_STEP : a,
                    )
                  }
                  className="flex size-[27px] shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors text-base font-medium disabled:opacity-50"
                  disabled={amount >= TOPUP_MAX_AMOUNT}
                  aria-label="+"
                >
                  +
                </button>
              </div>

              <p className="text-center text-[10px] md:text-[11px] text-white mb-[34px]">
                {t('EnergyPhotoVideo', { photos, videos })}
              </p>

              <div className="border-t border-white/10 pt-[24px] mb-[24px]">
                <p className="text-center text-[38px] md:text-2xl font-bold text-white">
                  {formatPriceCurrencyFirst(
                    totalPrice,
                    plan.userCurrency ?? plan.currency,
                  )}
                </p>
              </div>

              <Button
                type="button"
                className="w-full rounded-[10px] font-semibold mb-[24px] bg-linear-to-r from-[#B812CA] to-[#4B44D6] text-black hover:opacity-90"
                disabled={processingPlanId === plan.id}
                onClick={() => handleTopUp(plan)}
              >
                {processingPlanId === plan.id
                  ? t('Plan.ButtonProcessing')
                  : t('ButtonTopUp')}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] md:text-[20px] text-white">
                <Image
                  src="/assets/flask_green.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="w-[21px] h-[21px] md:w-8 md:h-8 shrink-0"
                />
                {t('EnergyBonusLabel', { count: 1500 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
