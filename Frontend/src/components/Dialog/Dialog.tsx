import React from 'react';

import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { type Breakpoint } from '@mui/material';

interface DialogProps {
   children: React.ReactNode;
   open: boolean;
   title: string;
   onClose: () => void;

   maxWidth?: Breakpoint;
   fullWidth?: boolean;
   fullScreen?: boolean;
   showDialogTitle?: boolean;
}

function Dialog({
   children,
   onClose,
   open,
   title,
   fullScreen,
   fullWidth,
   showDialogTitle = true,
   maxWidth,
}: DialogProps) {
   return (
      <MuiDialog open={open} maxWidth={maxWidth} fullWidth={fullWidth} fullScreen={fullScreen}>
         {showDialogTitle && (
            <DialogTitle
               bgcolor={fullScreen ? '#FF6600' : 'white'}
               color={fullScreen ? 'white' : 'black'}
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
               }}
            >
               {title}
               <IconButton onClick={onClose}>
                  <Close sx={{ color: fullScreen ? 'white' : 'inherit' }} />
               </IconButton>
            </DialogTitle>
         )}

         <DialogContent sx={{ padding: 0 }}>{children}</DialogContent>
      </MuiDialog>
   );
}

export default Dialog;
