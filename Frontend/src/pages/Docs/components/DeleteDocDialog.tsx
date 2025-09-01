// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useDeleteDocMutation } from '../../../services/docs.service';

// Types
import type { Doc } from '../../../services/docs.service';

import { enqueueSnackbar } from 'notistack';

interface DeleteDocDialogProps {
   open: boolean;
   onClose: () => void;
   doc: Doc;
}

function DeleteDocDialog(props: DeleteDocDialogProps) {
   const { open, onClose, doc } = props;

   const [deleteDoc] = useDeleteDocMutation();

   const handleDelete = async () => {
      try {
         await deleteDoc({ documentID: doc.id }).unwrap();
         enqueueSnackbar({ variant: 'success', message: 'Documented Deleted Successfully' });
         onClose();
      } catch (e: any) {
         const message = e?.data?.message || 'Something Went Wrong';
         enqueueSnackbar({ variant: 'error', message });
      }
   };

   return (
      <Dialog open={open} onClose={onClose} maxWidth={false}>
         <DialogTitle sx={{ fontSize: 22, fontWeight: 300 }}>Delete File</DialogTitle>
         <DialogContent sx={{ fontSize: 18, width: 700 }}>
            Are you sure you want to delete {doc?.title} ?
         </DialogContent>
         <DialogActions>
            <Box display={'flex'} justifyContent={'flex-end'} gap={2} my={2} pr={2}>
               <Button variant="contained" onClick={onClose}>
                  Cancel
               </Button>
               <Button variant="contained" color="error" onClick={handleDelete}>
                  Delete
               </Button>
            </Box>
         </DialogActions>
      </Dialog>
   );
}

export default DeleteDocDialog;
