import axios from "axios";
import { BASE_URL } from "../app/Api";

export interface User {
    userId: string;
    email: string;
    name: string;
    bio: string;
    userType: string;
    createdAt: string;
    updatedAt: string;
    profilePicture: string;
}

export interface JwtAuthResponse {
    token: string;
    user: User;
}

export interface LoginReq {
    email: string;
    password: string;
}

export interface RegisterReq {
    email: string;
    password: string;
    name: string;
    bio: string;
    userType: 'CONSUMER' | 'INFLUENCER';
    profilePicture?: File | null; // Cambiar de bio a profilePicture
}

// Create methods to interact with the backend

// Register a new user
export const register = async (formData: FormData): Promise<JwtAuthResponse> => {
    const response = await axios.post<JwtAuthResponse>(`${BASE_URL}/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Asegúrate de que el tipo de contenido sea multipart/form-data
    });
    return response.data;
};

// Login a user
export const login = async (loginReq: LoginReq): Promise<JwtAuthResponse> => {
    const response = await axios.post<JwtAuthResponse>(`${BASE_URL}/auth/login`, loginReq);
    return response.data;
};

// Get user details
export const getUserDetails = async (userId: string): Promise<User> => {
    const response = await axios.get<User>(`${BASE_URL}/users/${userId}`);
    return response.data;
};
