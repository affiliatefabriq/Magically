const CURRENCY_SYMBOLS: Record<string, string> = {
  RUB: '₽',
  BYN: 'Br',
  USD: '$',
  EUR: '€',
};

export const formatPrice = (amount: number, currency: string) => {
  const upperCurrency = currency.toUpperCase();

  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency:
      upperCurrency === 'BYN' || upperCurrency === 'RUB'
        ? upperCurrency
        : 'RUB',
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const formatPriceCurrencyFirst = (amount: number, currency: string) => {
  const upperCurrency = currency.toUpperCase();
  const key =
    upperCurrency === 'BYN' ||
    upperCurrency === 'RUB' ||
    upperCurrency === 'USD' ||
    upperCurrency === 'EUR'
      ? upperCurrency
      : 'RUB';
  const symbol = CURRENCY_SYMBOLS[key] ?? CURRENCY_SYMBOLS.RUB;
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol} ${formatted}`;
};
