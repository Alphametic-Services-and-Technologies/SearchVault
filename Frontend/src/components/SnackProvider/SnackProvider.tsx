import { closeSnackbar, SnackbarProvider } from 'notistack';

import Box from '@mui/material/Box';

function SnackProvider() {
   return (
      <SnackbarProvider
         maxSnack={3}
         autoHideDuration={5000}
         preventDuplicate={true}
         anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
         style={{
            fontFamily: "'Roboto', 'sans-serif'",
            fontWeight: '500',
            letterSpacing: '1.5px',
            fontSize: '14px',
         }}
         action={(snackbarId) => (
            <Box
               onClick={() => closeSnackbar(snackbarId)}
               sx={{
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all ease-in 0.1s',
                  ':hover': {
                     backgroundColor: 'rgba(0,0,0, 0.2)',
                  },
               }}
            />
         )}
      />
   );
}

export default SnackProvider;