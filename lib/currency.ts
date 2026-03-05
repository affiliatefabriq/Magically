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
