import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import postValidationSchema from '../../../validations/postValidationSchema';
import { useAppDispatch } from '../../../hooks/redux/redux';
import { createPostAction } from '../../../slices/posts.slice';
import { enqueueSnackbar } from 'notistack';

interface FormValues {
   title: string;
   body: string;
   userId: number;
}

interface CreatePostFormProps {
   onSuccess: () => void;
}
function CreatePostForm({ onSuccess }: CreatePostFormProps) {
   const dispatch = useAppDispatch();

   const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
   } = useForm<FormValues>({
      defaultValues: {
         body: '',
         title: '',
         userId: 1,
      },
      resolver: yupResolver(postValidationSchema()) as Resolver<FormValues, any>,
   });

   const onSubmit: SubmitHandler<FormValues> = async (data) => {
      try {
         await dispatch(createPostAction(data)).unwrap();

         enqueueSnackbar({
            variant: 'success',
            message: 'Post created successfully',
         });

         onSuccess();
      } catch (e: any) {
         const message = e?.data?.message || 'Error Occurred';

         enqueueSnackbar({ variant: 'error', message });
      }
   };

   return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
         <Box display="flex" flexDirection="column" gap={2}>
            <TextField
               label="Title"
               {...register('title')}
               error={!!errors.title}
               helperText={errors.title?.message}
               fullWidth
            />
            <TextField
               label="Body"
               multiline
               rows={4}
               {...register('body')}
               error={!!errors.body}
               helperText={errors.body?.message}
               fullWidth
            />
            <TextField
               label="User ID"
               type="number"
               {...register('userId')}
               error={!!errors.userId}
               helperText={errors.userId?.message}
               fullWidth
            />
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
               {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
         </Box>
      </Box>
   );
}

export default CreatePostForm;
