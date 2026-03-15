export type UserPlanStatus =
  | 'trial'
  | 'active'
  | 'overdue'
  | 'cancelled'
  | 'expired'
  | 'noplan';

export type CurrentPlanResponse = {
  hasActivePlan: boolean;
  balance: number;
  tokensFromPlan: number;
  tokensFromTopup: number;
  status: UserPlanStatus;
  startDate: string | null;
  endDate: string | null;
  planName: string | null;
  planType: 'package' | 'subscription' | 'topup' | null;
  isTrial: boolean;
  autoRenew: boolean;
  gracePeriodEnd: string | null;
  cancelledAt: string | null;
};

export type TariffPlan = {
  id: string;
  name: string;
  tokenAmount: number;
  periodDays: number | null;
  price: number;
  currency: string;
  priceInUserCurrency?: number;
  userCurrency?: string;
};

export type TariffPeriod = 'month' | 'year';

export type UseTariffsResult = {
  plans: TariffPlan[];
  currentPlan: CurrentPlanResponse | null;
  period: TariffPeriod;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
