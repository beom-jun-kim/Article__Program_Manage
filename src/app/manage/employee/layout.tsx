'use client';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { EmployeeFilterContext, defaultEmployeeFilterValue, type EmployeeFilter } from '@/app/manage/employee/contexts';

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

const EmployeeLayout = ({ children }: { children?: React.ReactNode }) => {
  const [filter, setFilter] = useState<EmployeeFilter>(defaultEmployeeFilterValue);

  return (
    <Container>
      <EmployeeFilterContext.Provider value={{ ...filter, setFilter }}>{children}</EmployeeFilterContext.Provider>
    </Container>
  );
};

export default EmployeeLayout;
