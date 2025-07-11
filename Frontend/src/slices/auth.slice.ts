import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { LoginData, LoginResponse } from '../types/auth.type';
import { authService } from '../services/auth.service';

export interface AuthState {
   tenantId: string | null;
   loading: boolean;
   error: string | null;
   isAuthenticated: boolean;
   token: string | null;
}

const getAuthFromStorage = (): Partial<AuthState> => {
   const storedAuth = localStorage.getItem('auth');
   if (storedAuth) {
      try {
         const parsed = JSON.parse(storedAuth);
         return {
            token: parsed.token || null,
            tenantId: parsed.tenantId || null,
            isAuthenticated: !!(parsed.token && parsed.tenantId),
         };
      } catch {
         return {};
      }
   }
   return {};
};

const initialState: AuthState = {
   tenantId: null,
   loading: false,
   error: null,
   isAuthenticated: false,
   token: null,
   ...getAuthFromStorage(),
};

export const loginAction = createAsyncThunk<LoginResponse, LoginData>(
   'auth/login',
   async (loginData: LoginData, { rejectWithValue }) => {
      try {
         const response = await authService.login(loginData);
         return response;
      } catch (error: any) {
         return rejectWithValue(error.response?.data || { message: 'Login failed' });
      }
   }
);

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      logout: (state) => {
         state.tenantId = null;
         state.isAuthenticated = false;
         state.error = null;
         state.token = null;

         localStorage.removeItem('auth');
      },
      clearError: (state) => {
         state.error = null;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(loginAction.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(loginAction.fulfilled, (state, action) => {
            state.loading = false;

            const payload = action.payload as LoginResponse;

            state.token = payload.token;
            state.tenantId = payload.tenantid;
            state.isAuthenticated = true;

            const authData = {
               token: payload.token,
               tenantId: payload.tenantid,
            };
            localStorage.setItem('auth', JSON.stringify(authData));
         })
         .addCase(loginAction.rejected, (state, action) => {
            (state.loading = false), (state.error = action.payload as string);
         });
   },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
