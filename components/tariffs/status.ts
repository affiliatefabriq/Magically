import type { UserPlanStatus } from '@/components/tariffs/types';

export const USER_PLAN_STATUS_LABELS: Record<UserPlanStatus, string> = {
  trial: 'trial',
  active: 'active',
  overdue: 'overdue',
  cancelled: 'cancelled',
  expired: 'expired',
  noplan: 'noplan',
};
