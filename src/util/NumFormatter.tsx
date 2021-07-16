export const formatNumberWithCommas = (x: string) => {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatNumberWithDotAndCommas = (x: string, fixedCount: number) => {
  return formatNumberWithCommas(parseFloat(x).toFixed(fixedCount));
};
