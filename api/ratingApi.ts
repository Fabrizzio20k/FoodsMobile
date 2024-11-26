import axios from "axios";
import { BASE_URL } from "@/Api";

export interface Comment {
    userId: number;
    rating: number;
    comment: string;
    restaurantId: number;
}

export interface RestaurantRatingRequestDto {
    rating: number;
    comment: string;
}

export interface RestaurantRatingResponseDto {
    ratingId: number;
    rating: number;
    comment: string;
    userId: number;
    restaurantId: number;
    createdAt: string;
}

export const createRestaurantRating = async (
    data: RestaurantRatingRequestDto,
    token: string
): Promise<RestaurantRatingResponseDto> => {
    const response = await axios.post(`${BASE_URL}/restaurantratings`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getCommentsByRestaurantId = async (
    restaurantId: number,
    token: string
): Promise<Comment[]> => {
    try {
        const response = await axios.get<Comment[]>(`${BASE_URL}/restaurantratings/restaurants/${restaurantId}/comments`, {
            headers: {
                Authorization: `Bearer ${token}`, // Agregar token para autorización
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener comentarios del restaurante:", error);
        throw new Error("No se pudieron cargar los comentarios.");
    }
};