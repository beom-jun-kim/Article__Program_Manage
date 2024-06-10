import React from 'react';

export interface EmployeeFilter {
  enabled?: boolean;
  empName?: string;
  empNameEn?: string;
  empId?: string;
  email?: string;
  phone?: string;
  admin?: string;
  genderSeq?: 1002001 | 1002002;
  birth?: string;
  dept?: string;
  country?: string;
}

export const defaultEmployeeFilterValue: EmployeeFilter & { setFilter: (values: EmployeeFilter) => void } = {
  enabled: false,
  empName: '',
  empNameEn: '',
  empId: '',
  email: '',
  phone: '',
  admin: 'all',
  genderSeq: undefined,
  birth: '',
  dept: '',
  country: '',
  setFilter: () => {}
};

export const EmployeeFilterContext = React.createContext<typeof defaultEmployeeFilterValue>(defaultEmployeeFilterValue);
