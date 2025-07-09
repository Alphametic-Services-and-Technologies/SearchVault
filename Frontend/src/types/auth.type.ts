export interface LoginData{
    email:string,
    password:string
}

export interface AuthState{
    user: any|null,
    loading: boolean,
    error: string|null,
    isAuthenticated: boolean
    token: string | null;
}

export interface LoginResponse{
    item1: string;
    tenantid: string;
}