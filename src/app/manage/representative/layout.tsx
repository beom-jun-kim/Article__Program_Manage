'use client';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  RepresentativeFilterContext,
  defaultRepresentativeFilterValue,
  type RepresentativeFilter
} from '@/app/manage/representative/contexts';

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

const RepresentativeLayout = ({ children }: { children?: React.ReactNode }) => {
  const [filter, setFilter] = useState<RepresentativeFilter>(defaultRepresentativeFilterValue);

  return (
    <Container>
      <RepresentativeFilterContext.Provider value={{ ...filter, setFilter }}>
        {children}
      </RepresentativeFilterContext.Provider>
    </Container>
  );
};

export default RepresentativeLayout;
