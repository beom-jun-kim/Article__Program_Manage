import React from 'react';

export interface DepartmentFilter {
  enabled?: boolean;
  deptName?: string;
  deptNameEn?: string;
  deptPhone?: string;
  deptFax?: string;
}

export const defaultDepartmentFilterValue: DepartmentFilter & { setFilter: (values: DepartmentFilter) => void } = {
  enabled: false,
  deptName: '',
  deptNameEn: '',
  deptPhone: '',
  deptFax: '',
  setFilter: () => {}
};

export const DepartmentFilterContext =
  React.createContext<typeof defaultDepartmentFilterValue>(defaultDepartmentFilterValue);
