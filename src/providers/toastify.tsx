'use client';
import React from 'react';
import { useTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';

const ToastifyProvider = ({ children }: { children?: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <>
      <ToastContainer position="bottom-left" theme={theme.palette.mode} style={{ width: '260px' }} />
      {children}
    </>
  );
};

export default ToastifyProvider;
