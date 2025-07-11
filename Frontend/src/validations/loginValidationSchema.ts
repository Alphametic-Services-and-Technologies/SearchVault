import * as yup from 'yup'

const loginValidationSchema = () => {
    return yup.object().shape({
        email: yup
            .string()
            .required('Email is required')
            .email('Please enter a valid email'),

        password: yup
            .string()
            .required('Password is required')
            .min(6, 'Password must be at least 8 characters')
    })
}

export default loginValidationSchema;