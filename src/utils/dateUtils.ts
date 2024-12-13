import { differenceInCalendarDays, isSameDay } from 'date-fns';

export const calculateLeaveDays = (startDate: Date, endDate: Date): number => {
  // If start and end dates are the same, return 1 day
  if (isSameDay(startDate, endDate)) {
    return 1;
  }
  
  // If it's consecutive days, return 1 day
  const diffInDays = differenceInCalendarDays(endDate, startDate);
  if (diffInDays === 1) {
    return 1;
  }
  
  // For other cases, include both start and end dates
  return diffInDays + 1;
};

export const validateLeaveRequest = (
  availableLeave: number,
  requestedDays: number,
  izinTuru: 'yillik' | 'haftalik'
): { 
  isValid: boolean;
  message: string;
  needsExtra: boolean;
} => {
  if (availableLeave <= 0) {
    return {
      isValid: false,
      message: `Personelin ${izinTuru === 'yillik' ? 'yıllık' : 'haftalık'} izin hakkı bulunmamaktadır.`,
      needsExtra: true
    };
  }

  if (requestedDays > availableLeave) {
    return {
      isValid: false,
      message: `Talep edilen ${requestedDays} gün izin, mevcut ${availableLeave} gün izin hakkından fazladır.`,
      needsExtra: true
    };
  }

  return {
    isValid: true,
    message: '',
    needsExtra: false
  };
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  
  const start = startDate.toLocaleDateString('tr-TR', options);
  const end = endDate.toLocaleDateString('tr-TR', options);
  
  return `${start} - ${end}`;
};