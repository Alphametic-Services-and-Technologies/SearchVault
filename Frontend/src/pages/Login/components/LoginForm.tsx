import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "../../../hooks/redux/redux";
import type { LoginData } from "../../../types/auth.type";
import loginValidationSchema from "../../../validations/loginValidationSchema";
import { useForm, type SubmitHandler } from "react-hook-form";
import { loginAction } from "../../../slices/auth.slice";
import { enqueueSnackbar } from "notistack";
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginFormProps {
    onSuccess: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting }
    } = useForm<LoginData>({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: yupResolver(loginValidationSchema()),
    });

    const onSubmit: SubmitHandler<LoginData> = async (data) => {
        try {
            const response = await dispatch(loginAction(data)).unwrap();

            console.log('Login Response:', JSON.stringify(response, null, 2));

            enqueueSnackbar({
                variant: 'success',
                message: 'Login successfully'
            });
            onSuccess();
        } catch (error: any) {
            const message = error?.data?.message || 'Login Failed';
            enqueueSnackbar({ variant: 'error', message });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                />
                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    size="large"
                    endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
                    sx={{
                        backgroundColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: '#1e3333'
                        },
                        '&:disabled': {
                            backgroundColor: '#8a9a9a'
                        }
                    }}
                >
                    Login
                </Button>
            </Box>
        </Box>
    );
}

export default LoginForm;