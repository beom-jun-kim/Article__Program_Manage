'use client';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  DepartmentFilterContext,
  defaultDepartmentFilterValue,
  type DepartmentFilter
} from '@/app/manage/department/contexts';

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

const DepartmentLayout = ({ children }: { children?: React.ReactNode }) => {
  const [filter, setFilter] = useState<DepartmentFilter>(defaultDepartmentFilterValue);

  return (
    <Container>
      <DepartmentFilterContext.Provider value={{ ...filter, setFilter }}>{children}</DepartmentFilterContext.Provider>
    </Container>
  );
};

export default DepartmentLayout;
