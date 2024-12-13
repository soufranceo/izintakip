import { differenceInCalendarDays, isSameDay, differenceInYears, addWeeks, isWithinInterval } from 'date-fns';

export const calculateLeaveDays = (startDate: Date, endDate: Date): number => {
  // If dates are the same, it's counted as 1 day
  if (isSameDay(startDate, endDate)) {
    return 1;
  }

  // Calculate the difference in days and subtract 1 to exclude the end date
  const diffInDays = differenceInCalendarDays(endDate, startDate);
  return diffInDays;
};

export const calculateAvailableLeave = (
  isGirisTarihi: Date,
  izinTuru: 'yillik' | 'haftalik',
  kullanilmisIzinler: { baslangicTarihi: Date; bitisTarihi: Date; gun: number }[]
): number => {
  const today = new Date();
  
  if (izinTuru === 'haftalik') {
    // Calculate total weeks worked
    const totalWeeks = Math.floor(differenceInCalendarDays(today, new Date(isGirisTarihi)) / 7);
    
    // Calculate total weekly leaves earned (1 day per week)
    const totalWeeklyLeaves = totalWeeks;
    
    // Calculate used weekly leaves
    const usedWeeklyLeaves = kullanilmisIzinler.reduce((total, izin) => {
      // Only count leaves from the current week
      const currentWeekStart = addWeeks(today, -1);
      if (isWithinInterval(new Date(izin.baslangicTarihi), { start: currentWeekStart, end: today })) {
        return total + izin.gun;
      }
      return total;
    }, 0);
    
    // Return available leaves including carried over unused leaves
    return totalWeeklyLeaves - usedWeeklyLeaves;
  } else {
    // For yearly leaves
    const yearsWorked = differenceInYears(today, new Date(isGirisTarihi));
    const baseYearlyLeave = 14;
    
    // Calculate total yearly leaves including carried over
    const totalYearlyLeaves = baseYearlyLeave * (yearsWorked + 1);
    
    // Calculate used yearly leaves
    const usedYearlyLeaves = kullanilmisIzinler.reduce((total, izin) => total + izin.gun, 0);
    
    return totalYearlyLeaves - usedYearlyLeaves;
  }
};

export const validateLeaveBalance = (
  availableLeave: number,
  requestedDays: number,
  izinTuru: 'yillik' | 'haftalik'
): {
  isValid: boolean;
  message: string;
  needsExtraLeave: boolean;
} => {
  if (availableLeave <= 0) {
    return {
      isValid: false,
      message: `${izinTuru === 'yillik' ? 'Yıllık' : 'Haftalık'} izin hakkı bulunmamaktadır.`,
      needsExtraLeave: true
    };
  }

  if (requestedDays > availableLeave) {
    return {
      isValid: false,
      message: `Talep edilen ${requestedDays} gün izin, mevcut ${availableLeave} gün izin hakkından fazladır.`,
      needsExtraLeave: true
    };
  }

  return {
    isValid: true,
    message: '',
    needsExtraLeave: false
  };
};

export const calculateRemainingLeave = (
  personel: { isGirisTarihi: Date; id: number },
  izinTuru: 'yillik' | 'haftalik',
  kullanilmisIzinler: { baslangicTarihi: Date; bitisTarihi: Date; gun: number }[]
): number => {
  const available = calculateAvailableLeave(personel.isGirisTarihi, izinTuru, kullanilmisIzinler);
  return Math.max(0, available);
};