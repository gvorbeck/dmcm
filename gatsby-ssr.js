import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './src/theme';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>{element}</ThemeProvider>
);
