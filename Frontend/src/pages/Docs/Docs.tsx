import React, { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

// Mui
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import {
   CloudUpload as UploadIcon,
   Description as FileIcon,
   Description as FolderIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import DeleteDocDialog from './components/DeleteDocDialog';

import { useGetDocsQuery, type Doc, useUploadDocMutation } from '../../services/docs.service';

const Docs: React.FC = () => {
   const theme = useTheme();

   const [doc, setDoc] = useState<Doc | null>(null);

   const { data: docs, isLoading, isFetching } = useGetDocsQuery();

   const [uploadDoc, { isLoading: isUploadDocLoading }] = useUploadDocMutation();

   const handleDocUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
         const files = event.target.files;
         if (!files || files.length === 0) return;

         const formData = new FormData();

         formData.append('File', files[0]);

         await uploadDoc(formData).unwrap();
         enqueueSnackbar({
            variant: 'success',
            message: 'Document Uploaded Successfully',
         });
      } catch (e: any) {
         const message = e?.data?.message || 'Something Went Wrong';
         enqueueSnackbar({ variant: 'error', message });
      }
   };

   if (isLoading || isFetching) {
      return (
         <Box display={'flex'} justifyContent={'center'} height="100%" alignItems={'center'}>
            <CircularProgress size={50} />
         </Box>
      );
   }

   if (!docs) {
      return <></>;
   }

   return (
      <>
         <Box sx={{ height: '100%', overflow: 'auto' }}>
            {/* Header */}
            <Paper
               sx={{ p: 3, mb: 3, backgroundColor: theme.palette.primary.main, color: 'white' }}
            >
               <Box display="flex" alignItems="center" gap={2}>
                  <FolderIcon sx={{ fontSize: 32 }} />
                  <Box>
                     <Typography variant="h5" fontWeight="bold">
                        Documents
                     </Typography>
                     <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Upload and manage your files
                     </Typography>
                  </Box>
               </Box>
            </Paper>

            {/* Upload Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
               <Typography variant="h6" gutterBottom>
                  Upload New Document
               </Typography>
               <input
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                  style={{ display: 'none' }}
                  id="upload-button"
                  type="file"
                  onChange={handleDocUpload}
               />
               <label htmlFor="upload-button">
                  <Button
                     variant="contained"
                     component="span"
                     startIcon={!isUploadDocLoading ? <UploadIcon /> : undefined}
                     sx={{ width: 300, height: 50 }}
                  >
                     {isUploadDocLoading ? (
                        <CircularProgress sx={{ color: 'white' }} size={30} />
                     ) : (
                        'Choose File to Upload'
                     )}
                  </Button>
               </label>
            </Paper>

            {/* Documents List */}
            <Paper sx={{ p: 3 }}>
               <Typography variant="h6" gutterBottom>
                  Your Documents ({docs.length})
               </Typography>

               {docs.length === 0 ? (
                  <Box textAlign="center" py={4}>
                     <Typography color="text.secondary" gutterBottom>
                        No documents uploaded yet
                     </Typography>
                     <Typography variant="caption" color="text.secondary">
                        {/* Show helpful message if there are API connection issues */}
                        {window.navigator.onLine
                           ? 'Upload a file to get started'
                           : 'Check your internet connection'}
                     </Typography>
                  </Box>
               ) : (
                  <List>
                     {Array.isArray(docs) &&
                        docs.map((doc, index) => (
                           <React.Fragment key={doc.id}>
                              <ListItem>
                                 <ListItemIcon>
                                    <FileIcon color="primary" />
                                 </ListItemIcon>
                                 <ListItemText
                                    primary={doc.fileName}
                                    secondary={`• Uploaded ${new Date(
                                       doc.uploadedAt
                                    ).toLocaleString()}`}
                                 />
                                 <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setDoc(doc)}
                                    color="error"
                                 >
                                    Delete
                                 </Button>
                              </ListItem>
                              {index < docs.length - 1 && <Divider />}
                           </React.Fragment>
                        ))}
                  </List>
               )}
            </Paper>
         </Box>
         <DeleteDocDialog open={Boolean(doc)} onClose={() => setDoc(null)} doc={doc!} />
      </>
   );
};

export default Docs;
