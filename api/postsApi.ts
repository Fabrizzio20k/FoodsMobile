import axios from "axios";
import { BASE_URL } from "@/Api";
import { toast } from "sonner";

export interface Post {
    postId: number;
    title: string;
    content: string;
    image: string;
    createdDate: string;
    status: string;
    userId: number;
    userName: string;
    userProfilePicture: string;
}

export interface PostRequestDto {
    title: string;
    content: string;
    userId: string;
    status: string;
}

export interface PostResponseDto {
    postId: number;
    title: string;
    content: string;
    image: string;
    createdDate: string;
    status: string;
    userId: number;
    userName: string;
    userProfilePicture: "";
}

// Function to get all posts
export const getAllPosts = async (token: string): Promise<PostResponseDto[]> => {
    const response = await axios.get<PostResponseDto[]>(`${BASE_URL}/posts`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updatePost = async (
    postId: number,
    postRequestDto: PostRequestDto,
    image: File | null,
    token: string
): Promise<PostResponseDto | null> => {
    try {
        const formData = new FormData();

        formData.append(
            "post",
            new Blob([JSON.stringify(postRequestDto)], { type: "application/json" })
        );

        if (image) {
            formData.append("image", image);
        }

        const response = await axios.put<PostResponseDto>(`${BASE_URL}/posts/${postId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Error en la respuesta del servidor
            toast.error(error.response.data || "Error al actualizar el post");
        } else if (error.request) {
            // El servidor no respondió
            toast.error("No se recibió respuesta del servidor");
        } else {
            // Error al configurar la solicitud
            toast.error("Error en la solicitud: " + error.message);
        }

        return null; // Devuelve null si hay un error
    }
};

export const createPost = async (
    postRequestDto: PostRequestDto,
    image: File | null,
    token: string
): Promise<PostResponseDto> => {
    try {
        const formData = new FormData();

        formData.append(
            "post",
            new Blob([JSON.stringify(postRequestDto)], { type: "application/json" })
        );

        if (image) {
            formData.append("image", image);
        }

        const response = await axios.post<PostResponseDto>(`${BASE_URL}/posts`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Devolver los datos del post creado
    } catch (error: any) {
        // Lanzar el error con más información para manejarlo en el frontend
        throw error.response
            ? new Error(error.response.data.message || "Error al crear el post")
            : new Error("Error de red o problema desconocido");
    }
};

export const deletePost = async (postId: number, token: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
