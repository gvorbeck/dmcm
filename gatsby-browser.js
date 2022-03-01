import React from 'react';
import { unstable_ClassNameGenerator as ClassNameGenerator } from '@mui/material/utils';
import { ThemeProvider } from '@mui/material/styles';
import theme from './src/theme';

// Assign site-wide classname prefix.
ClassNameGenerator.configure((componentName) => componentName.replace('Mui', 'dmcm-'));
console.log('theme', theme);
export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme}>{element}</ThemeProvider>
);
