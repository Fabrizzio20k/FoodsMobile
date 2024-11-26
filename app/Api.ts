import axios from "axios";

// Tipos de datos
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

export const BASE_URL = "http://100.26.136.62:8080";

// **1. Registro de un nuevo usuario**
export const register = async (formData: FormData): Promise<JwtAuthResponse> => {
    try {
        const response = await axios.post<JwtAuthResponse>(
            `${BASE_URL}/auth/register`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Manejo específico de errores de Axios
            console.error("Error al registrarse:", error.response?.data || error.message);
            throw error.response?.data?.message || "Error desconocido durante el registro";
        }
        console.error("Error inesperado:", error);
        throw "Error desconocido durante el registro";
    }
};

// **2. Inicio de sesión**
export const login = async (loginReq: LoginReq): Promise<JwtAuthResponse> => {
    try {
        const response = await axios.post<JwtAuthResponse>(
            `${BASE_URL}/auth/login`,
            loginReq
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error al iniciar sesión:", error.response?.data || error.message);
            throw error.response?.data?.message || "Error desconocido durante el inicio de sesión";
        }
        console.error("Error inesperado:", error);
        throw "Error desconocido durante el inicio de sesión";
    }
};

// **3. Obtener detalles de usuario**
export const getUserDetails = async (userId: string): Promise<User> => {
    try {
        const response = await axios.get<User>(`${BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error al obtener detalles del usuario:", error.response?.data || error.message);
            throw error.response?.data?.message || "Error desconocido al obtener detalles del usuario";
        }
        console.error("Error inesperado:", error);
        throw "Error desconocido al obtener detalles del usuario";
    }
};
