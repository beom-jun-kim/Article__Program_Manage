'use client';
import React from 'react';
import { Global, css } from '@emotion/react';
import { CssBaseline } from '@mui/material';

const GlobalStyles = () => {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Global
        styles={css`
          html,
          body,
          #root {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }

          body {
            position: relative;
          }

          #root {
            display: flex;
            flex-direction: column;
          }

          #main {
            max-width: 100%;
            padding: 25px;
            flex: 1;
            overflow: hidden;
          }

          .rdg-row:not(:hover)[aria-selected='false'] {
            .grid-cell-disabled-light {
              background-color: #eee;
            }

            .grid-cell-disabled-dark {
              background-color: #333;
            }
          }

          .dialog-title {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        `}
      />
    </>
  );
};

export default GlobalStyles;
