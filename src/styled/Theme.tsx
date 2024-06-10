'use client';
import React from 'react';
import { useCookies } from 'react-cookie';
import { PaletteMode, ThemeProvider, createTheme } from '@mui/material';

const themes = {
  light: createTheme({
    palette: { mode: 'light', primary: { main: '#2A919A' }, secondary: { main: '#DDD' } },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: '#595757'
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            fill: '#595757'
          }
        }
      }
    }
  }),
  dark: createTheme({
    palette: { mode: 'dark', primary: { main: '#2A919A' }, secondary: { main: '#333' } },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: '#eee'
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            fill: '#eee'
          }
        }
      }
    }
  })
};

const Theme = ({ children }: { children?: React.ReactNode }) => {
  const [cookies] = useCookies(['theme']);
  const themeMode: PaletteMode =
    (typeof window === 'undefined' ? require('next/headers').cookies().get('theme')?.value : cookies.theme) ?? 'light';
  return <ThemeProvider theme={themes[themeMode]}>{children}</ThemeProvider>;
};

export default Theme;
