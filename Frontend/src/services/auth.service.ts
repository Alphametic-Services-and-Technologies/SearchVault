import { type AxiosResponse } from "axios";
import type { LoginData, LoginResponse } from "../types/auth.type";
import axiosInstance from "../utils/axios";

export const authService = {
    login: async (loginData:LoginData):Promise<LoginResponse> => {
        const response: AxiosResponse<LoginResponse> = await axiosInstance.post('/Auth/login', loginData);

        console.log(response)

        return response.data;
    }
}