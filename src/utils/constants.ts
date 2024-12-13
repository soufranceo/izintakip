export const LEAVE_TYPES = {
  YEARLY: 'yillik',
  WEEKLY: 'haftalik'
} as const;

export const LEAVE_TYPE_LABELS = {
  [LEAVE_TYPES.YEARLY]: 'Yıllık İzin',
  [LEAVE_TYPES.WEEKLY]: 'Haftalık İzin'
} as const;

export const DEFAULT_YEARLY_LEAVE = 14;
export const DEFAULT_WEEKLY_LEAVE = 2;

export const MIN_LEAVE_DAYS = 1;
export const MAX_LEAVE_DAYS = 365;