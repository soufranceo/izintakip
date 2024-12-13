export const formatDateTR = (date: Date): string => {
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${formatDateTR(startDate)} - ${formatDateTR(endDate)}`;
};

export const formatLeaveDuration = (days: number): string => {
  return `${days} gün`;
};