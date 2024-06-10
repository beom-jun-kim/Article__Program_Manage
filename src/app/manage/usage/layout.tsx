'use client';
import React from 'react';
import styled from '@emotion/styled';
import { Theme, useTheme } from '@mui/material';

const Container = styled.div<{ muitheme: Theme }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;

  .page-wrapper {
    min-width: 800px;

    .manage-grid-container {
      width: 100%;
      height: 100%;
    }

    table {
      margin-top: 10px;

      tbody {
        tr {
          th,
          td {
            text-align: left;
            padding-top: 10px;
          }

          td * {
            color: ${({ muitheme }) => muitheme.palette.primary.main};
          }
        }
      }
    }
  }
`;

const UsageLayout = ({ children }: { children?: React.ReactNode }) => {
  const theme = useTheme();
  return <Container muitheme={theme}>{children}</Container>;
};

export default UsageLayout;
