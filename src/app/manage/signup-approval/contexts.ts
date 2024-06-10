import React from 'react';

export interface SignupApprovalFilter {
  enabled?: boolean;
  username?: string;
  usernameEn?: string;
  email?: string;
  phone?: string;
  genderSeq?: 1002001 | 1002002;
  birth?: string;
  country?: string;
  createDate?: string;
}

export const defaultSignupApprovalFilterValue: SignupApprovalFilter & {
  setFilter: (values: SignupApprovalFilter) => void;
} = {
  enabled: false,
  username: '',
  usernameEn: '',
  email: '',
  phone: '',
  genderSeq: undefined,
  birth: '',
  country: '',
  createDate: '',
  setFilter: () => {}
};

export const SignupApprovalFilterContext = React.createContext<typeof defaultSignupApprovalFilterValue>(
  defaultSignupApprovalFilterValue
);
