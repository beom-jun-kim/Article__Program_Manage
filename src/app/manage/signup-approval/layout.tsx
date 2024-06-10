'use client';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  SignupApprovalFilterContext,
  defaultSignupApprovalFilterValue,
  type SignupApprovalFilter
} from '@/app/manage/signup-approval/contexts';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: hidden;

  .manage-grid-container {
    width: 100%;
    height: 100%;
  }
`;

const SignupApprovalLayout = ({ children }: { children?: React.ReactNode }) => {
  const [filter, setFilter] = useState<SignupApprovalFilter>(defaultSignupApprovalFilterValue);

  return (
    <Container>
      <SignupApprovalFilterContext.Provider value={{ ...filter, setFilter }}>
        {children}
      </SignupApprovalFilterContext.Provider>
    </Container>
  );
};

export default SignupApprovalLayout;
