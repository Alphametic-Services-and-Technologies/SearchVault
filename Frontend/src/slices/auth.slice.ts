import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthState, LoginData } from "../types/auth.type";
import { authService } from "../services/auth.service";



const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('authToken'),
    token: localStorage.getItem('authToken'),
};

export const loginAction = createAsyncThunk('auth/login', async (loginData: LoginData, { rejectWithValue }) => {
    try {
        const response = await authService.login(loginData);
        return response;
    }
    catch (error: any) {
        return rejectWithValue(error.response?.data || { message: 'Loginfailed' });
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null,
                state.isAuthenticated = false,
                state.error = null

            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAction.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(loginAction.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.tenantid;
                state.token = action.payload.item1;
                state.isAuthenticated = true;
                localStorage.setItem('authToken', action.payload.item1);
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(loginAction.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload as string
            });
    }
});


export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;