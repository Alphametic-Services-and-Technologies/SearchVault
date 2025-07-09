import { createTheme } from '@mui/material/styles';

const theme = createTheme({
   palette: {
      primary: {
         main: '#2F4F4F',
         light: '#4a6b6b',
         dark: '#1e3333',
         contrastText: '#ffffff',
      },
   },
});

export default theme;