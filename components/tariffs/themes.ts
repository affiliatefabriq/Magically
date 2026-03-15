export const TARIFF_THEMES = [
  {
    slug: 'green',
    flask: '/assets/flask_green.svg',
    point: '/assets/point_green.svg',
    gradient: 'bg-linear-to-r from-[#AAFF00] to-[#268660]',
    buttonClass:
      'bg-linear-to-r from-[#AAFF00] to-[#268660] text-black hover:opacity-90',
    energyBonus: 0,
  },
  {
    slug: 'orange',
    flask: '/assets/flask_orange.svg',
    point: '/assets/point_orange.svg',
    gradient: 'bg-linear-to-b from-[#A03410] via-[#F8AA26] to-[#FFE577]',
    buttonClass:
      'bg-linear-to-b from-[#A03410] via-[#F8AA26] to-[#FFE577] text-black hover:opacity-90',
    energyBonus: 100,
  },
  {
    slug: 'purple',
    flask: '/assets/flask_purple.svg',
    point: '/assets/point_purple.svg',
    gradient: 'bg-linear-to-r from-[#B812CA] to-[#4B44D6]',
    buttonClass:
      'bg-linear-to-r from-[#B812CA] to-[#4B44D6] text-black hover:opacity-90',
    energyBonus: 400,
  },
  {
    slug: 'cyan',
    flask: '/assets/flask_green.svg',
    point: '/assets/point_green.svg',
    gradient: 'bg-linear-to-r from-[#06B6D4] to-[#0D9488]',
    buttonClass:
      'bg-linear-to-r from-[#06B6D4] to-[#0D9488] text-black hover:opacity-90',
    energyBonus: 0,
  },
  {
    slug: 'rose',
    flask: '/assets/flask_orange.svg',
    point: '/assets/point_orange.svg',
    gradient: 'bg-linear-to-r from-[#F43F5E] to-[#E11D48]',
    buttonClass:
      'bg-linear-to-r from-[#F43F5E] to-[#E11D48] text-black hover:opacity-90',
    energyBonus: 0,
  },
  {
    slug: 'blue',
    flask: '/assets/flask_purple.svg',
    point: '/assets/point_purple.svg',
    gradient: 'bg-linear-to-r from-[#3B82F6] to-[#2563EB]',
    buttonClass:
      'bg-linear-to-r from-[#3B82F6] to-[#2563EB] text-black hover:opacity-90',
    energyBonus: 0,
  },
  {
    slug: 'amber',
    flask: '/assets/flask_green.svg',
    point: '/assets/point_green.svg',
    gradient: 'bg-linear-to-r from-[#F59E0B] to-[#D97706]',
    buttonClass:
      'bg-linear-to-r from-[#F59E0B] to-[#D97706] text-black hover:opacity-90',
    energyBonus: 0,
  },
  {
    slug: 'pink',
    flask: '/assets/flask_orange.svg',
    point: '/assets/point_orange.svg',
    gradient: 'bg-linear-to-r from-[#EC4899] to-[#DB2777]',
    buttonClass:
      'bg-linear-to-r from-[#EC4899] to-[#DB2777] text-black hover:opacity-90',
    energyBonus: 0,
  },
  {
    slug: 'emerald',
    flask: '/assets/flask_purple.svg',
    point: '/assets/point_purple.svg',
    gradient: 'bg-linear-to-r from-[#34D399] to-[#059669]',
    buttonClass:
      'bg-linear-to-r from-[#34D399] to-[#059669] text-black hover:opacity-90',
    energyBonus: 0,
  },
] as const;

const YEAR_DAYS_THRESHOLD = 300;

export function getDisplayPlans<T extends { periodDays?: number | null }>(
  plans: T[],
  period: 'month' | 'year',
): T[] {
  const filtered =
    period === 'year'
      ? plans.filter((p) => (p.periodDays ?? 0) >= YEAR_DAYS_THRESHOLD)
      : plans.filter((p) => (p.periodDays ?? 0) < YEAR_DAYS_THRESHOLD);
  return filtered.length > 0 ? filtered : plans;
}

export function getThemeForPlanIndex(index: number) {
  const i = Math.min(Math.max(0, index), TARIFF_THEMES.length - 1);
  return TARIFF_THEMES[i];
}

export function getTaglineKeys(index: number): {
  line1: string;
  line2: string;
} {
  const line1 =
    index === 0
      ? 'PlanTagline1Line1'
      : index === 1
        ? 'PlanTagline2Line1'
        : index === 2
          ? 'PlanTagline3Line1'
          : 'PlanTaglineDefaultLine1';
  const line2 =
    index === 0
      ? 'PlanTagline1Line2'
      : index === 1
        ? 'PlanTagline2Line2'
        : index === 2
          ? 'PlanTagline3Line2'
          : 'PlanTaglineDefaultLine2';
  return { line1, line2 };
}
