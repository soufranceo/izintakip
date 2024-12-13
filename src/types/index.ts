export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  tcNo: string;
  username: string;
  password: string;
  startDate: string;
  endDate?: string;
  weeklyLeave: number;
  annualLeave: number;
  usedLeaves: Leave[];
}

export interface Leave {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: 'WEEKLY' | 'ANNUAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}