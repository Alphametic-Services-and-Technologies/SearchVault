import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

import { useForm, type SubmitHandler } from 'react-hook-form';

interface FormValues {
   message: string;
}

interface MessageBoxFormProps {
   onFormSubmit: (message: FormValues) => void;
   disableSubmit?: boolean;
}
function MessageBoxForm({ onFormSubmit, disableSubmit = false }: MessageBoxFormProps) {
   const { handleSubmit, register, reset, watch } = useForm<FormValues>();

   const message = watch('message');

   const onSubmit: SubmitHandler<FormValues> = (data) => {
      reset();
      onFormSubmit(data);
   };

   return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
         <Box display="flex" gap={1}>
            <TextField
               fullWidth
               multiline
               maxRows={4}
               placeholder="Type your message..."
               onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();

                     if (disableSubmit || message?.length === 0) return;

                     handleSubmit(onSubmit)();
                  }
               }}
               {...register('message')}
            />

            <IconButton
               color="primary"
               type="submit"
               disabled={disableSubmit || message?.length === 0}
            >
               <SendIcon />
            </IconButton>
         </Box>
      </Box>
   );
}

export default MessageBoxForm;
