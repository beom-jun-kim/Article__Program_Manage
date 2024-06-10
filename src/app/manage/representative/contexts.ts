import React from 'react';

export interface RepresentativeFilter {
  enabled?: boolean;
  companyName?: string;
  custEmpName?: string;
  custEmpTel?: string;
  custEmpFax?: string;
  custEmpEmail?: string;
  custEmpPosition?: string;
}

export const defaultRepresentativeFilterValue: RepresentativeFilter & {
  setFilter: (values: RepresentativeFilter) => void;
} = {
  enabled: false,
  companyName: '',
  custEmpName: '',
  custEmpTel: '',
  custEmpFax: '',
  custEmpEmail: '',
  custEmpPosition: '',
  setFilter: () => {}
};

export const RepresentativeFilterContext = React.createContext<typeof defaultRepresentativeFilterValue>(
  defaultRepresentativeFilterValue
);
