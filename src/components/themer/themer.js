import {
  createTheme,
} from '@mui/material/styles';

export default function themer() {
  return createTheme({
    palette: {
      primary: {
        light: '#b9b744',
        main: '#86870d',
        dark: '#565a00',
        contrastText: '#000',
      },
      secondary: {
        light: '#8b372a',
        main: '#590700',
        dark: '#350000',
        contrastText: '#fff',
      },
      tertiary: {
        light: '#ffe7c5',
        main: '#d2b594',
        dark: '#a08566',
        contrastText: '#000000',
      },
    },
  });
}
