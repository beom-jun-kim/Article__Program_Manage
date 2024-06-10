'use client';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { CustomerFilterContext, defaultCustomerFilterValue, type CustomerFilter } from '@/app/manage/customer/contexts';

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

const CustomerLayout = ({ children }: { children?: React.ReactNode }) => {
  const [filter, setFilter] = useState<CustomerFilter>(defaultCustomerFilterValue);

  return (
    <Container>
      <CustomerFilterContext.Provider value={{ ...filter, setFilter }}>{children}</CustomerFilterContext.Provider>
    </Container>
  );
};

export default CustomerLayout;
