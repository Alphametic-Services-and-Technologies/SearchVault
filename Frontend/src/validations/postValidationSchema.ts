import * as yup from 'yup';

const postValidationSchema = () => {
   const schema = yup.object({
      title: yup
         .string()
         .required('Title is required')
         .min(3, 'Title must be at least 3 characters'),

      body: yup
         .string()
         .required('Body is required')
         .min(10, 'Body must be at least 10 characters'),

      userId: yup
         .number()
         .typeError('User ID must be a number')
         .required('User ID is required')
         .positive('User ID must be positive')
         .integer('User ID must be an integer'),
   });

   return schema;
};

export default postValidationSchema;
