import axios from "axios";
import { BASE_URL } from "../app/Api";

export interface Restaurant {
    restaurantId: number;
    name: string;
    email: string;
    latitude: number;
    longitude: number;
    image: string; // URL de la imagen
    status: 'OPEN' | 'CLOSED';
    createdDate: string; // Fecha de creación del restaurante
}

export interface RestaurantRequestDto {
    name: string;
    email: string;
    latitude: number;
    longitude: number;
    status: 'OPEN' | 'CLOSED';
    image?: File; // Archivo de imagen (opcional)
}

export interface RestaurantFilter {
    search?: string;
    rating?: number;
    country?: string; // No está en el backend, pero se puede manejar en el front
}

export const getAllRestaurants = async (token: string): Promise<Restaurant[]> => {
    const response = await axios.get(`${BASE_URL}/restaurants`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createRestaurant = async (data: RestaurantRequestDto, token: string): Promise<Restaurant> => {

    const formData = new FormData();
    formData.append("restaurant", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (data.image) {
        formData.append("image", data.image);
    }

    const response = await axios.post(`${BASE_URL}/restaurants`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateRestaurant = async (
    id: number,
    data: RestaurantRequestDto,
    token: string
): Promise<Restaurant> => {
    const formData = new FormData();
    formData.append("restaurant", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (data.image) {
        formData.append("image", data.image);
    }

    const response = await axios.put(`${BASE_URL}/restaurants/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};


// Función para eliminar un restaurante por ID
export const deleteRestaurant = async (id: number, token: String): Promise<void> => {
    await axios.delete(`${BASE_URL}/restaurants/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Agregar token en las cabeceras
        },
    });
};

export const getRestaurantById = async (id: number, token: String): Promise<Restaurant> => {
    const response = await axios.get(`${BASE_URL}/restaurants/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Agregar token en las cabeceras
        },
    });
    return response.data;
};

export const getRestaurants = async (token: string, filters?: RestaurantFilter): Promise<Restaurant[]> => {
    const response = await axios.get<Restaurant[]>(`${BASE_URL}/api/restaurants`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters, // Agrega filtros como parámetros en la solicitud
    });
    return response.data;
};