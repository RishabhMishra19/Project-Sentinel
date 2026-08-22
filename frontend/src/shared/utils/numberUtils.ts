export const formatDouble = (double: number, afterDecimalCount = 2): string => {
  return `${double.toFixed(afterDecimalCount)}%`;
};

export const formatNumber = (n: number): string => {
  return new Intl.NumberFormat().format(n);
};
