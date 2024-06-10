import React from 'react';

export interface CustomerFilter {
  enabled?: boolean;
  companyName?: string;
  companyShortName?: string;
  custCompanyTypeSeq?: number;
  companyTypeSeq?: number;
  companyNo?: string;
  ownerName?: string;
  tel?: string;
  email?: string;
  custStatusSeq?: number;
}

export const defaultCustomerFilterValue: CustomerFilter & { setFilter: (values: CustomerFilter) => void } = {
  enabled: false,
  companyName: '',
  companyShortName: '',
  custCompanyTypeSeq: undefined,
  companyTypeSeq: undefined,
  companyNo: '',
  ownerName: '',
  tel: '',
  email: '',
  custStatusSeq: undefined,
  setFilter: () => {}
};

export const CustomerFilterContext = React.createContext<typeof defaultCustomerFilterValue>(defaultCustomerFilterValue);
