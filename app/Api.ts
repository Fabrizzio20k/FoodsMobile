// api.ts

import axios from 'axios';

// Define the base URL for the backend
export const BASE_URL = 'http://18.205.56.44:8080';


export interface Food {
    foodId: number;
    name: string;
    description: string;
    price: number;
    restaurantId: number;
    status: string; // Ejemplo: 'AVAILABLE' o 'UNAVAILABLE'
    imageUrl: string | null;
}

export interface FoodRequestDto {
    name: string;
    description: string;
    price: number;
    restaurantId: number;
    status: string;
    image: File | null;
}

// Modelo para las calificaciones de los platillos
export interface FoodRating {
    foodRatingId: number;
    id: number;
    rating: number;
    comment: string;
    foodId: number;
    createdAt: string;
}

export interface FoodRatingRequestDto {
    rating: number;
    comment: string;
}

// api.ts

// Interfaces adicionales
export interface FoodFilter {
    search?: string;
    rating?: number;
    type?: string;
    country?: string; // No está en el backend, pero se puede usar para manejar el filtro en el front
    influencer?: string; // No está en el backend, pero se puede manejar en el front
}

// Modificación de los métodos para incluir parámetros de filtrado
export const getFoods = async (token: string, filters?: FoodFilter): Promise<Food[]> => {
    const response = await axios.get<Food[]>(`${BASE_URL}/api/foods`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filters, // Agrega filtros como parámetros en la solicitud
    });
    return response.data;
};

// Método para búsqueda en Google Maps
export const searchLocation = async (address: string): Promise<{ lat: number; lng: number }> => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''; // Usa la clave de Google Maps
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
            address,
            key: apiKey,
        },
    });

    if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
    } else {
        throw new Error('No se pudo encontrar la ubicación');
    }
};


export const fetchCurrentUserDetails = async (userId: number) => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error fetching user details");
    }

    return response.json();
};

// Modelo para las calificaciones de los restaurantes
export interface RestaurantRating {
    restaurantRatingId: number;
    rating: number;
    comment: string;
    userId: number;
    restaurantId: number;
    createdAt: string;
}

// Obtener todos los platillos de un restaurante
export const getFoodsByRestaurantId = async (restaurantId: number, token: string): Promise<Food[]> => {
    const response = await axios.get(`${BASE_URL}/foods/restaurants/${restaurantId}/foods`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data; // Asegúrate de que el backend incluye la URL de la imagen aquí
};

export const createFood = async (data: FoodRequestDto, token: string): Promise<Food> => {
    const formData = new FormData();

    // Adjuntar el objeto `food` como JSON serializado
    formData.append(
        'food',
        new Blob(
            [JSON.stringify({
                name: data.name,
                description: data.description,
                price: data.price,
                restaurantId: data.restaurantId,
                status: data.status,
            })],
            { type: 'application/json' } // Indica que es un JSON
        )
    );

    // Si hay una imagen, adjuntarla al FormData
    if (data.image) {
        formData.append('image', data.image);
    }

    // Realizar la solicitud POST a la API
    const response = await axios.post(`${BASE_URL}/foods`, formData, {
        headers: {
            Authorization: `Bearer ${token}`, // Token de autenticación
        },
    });

    // Retornar la respuesta en formato JSON
    return response.data;
};




// Actualizar un platillo existente con imagen
export const updateFood = async (foodId: number, data: FoodRequestDto, token: string): Promise<Food> => {
    //same as createFood with a different put request
    const formData = new FormData();
    formData.append(
        'food',
        new Blob(
            [JSON.stringify({
                name: data.name,
                description: data.description,
                price: data.price,
                restaurantId: data.restaurantId,
                status: data.status,
            })],
            { type: 'application/json' }
        )
    );

    if (data.image) {
        formData.append('image', data.image);
    }

    const response = await axios.put(`${BASE_URL}/foods/${foodId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }, // Token de autenticación
    });
    return response.data;
};



// Eliminar un platillo
export const deleteFood = async (foodId: number, token: String): Promise<void> => {
    await axios.delete(`${BASE_URL}/foods/${foodId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};


// Obtener todas las calificaciones de un platillo por su ID
export const getFoodRatingsByFoodId = async (foodId: number, token: String) => {
    const response = await axios.get(`${BASE_URL}/foodratings/food/${foodId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener una calificación específica por su ID
export const getFoodRatingById = async (id: number, token: String) => {
    const response = await axios.get(`${BASE_URL}/foodratings/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Crear una nueva calificación para un platillo
export const createFoodRating = async (data: { foodId: number; userId: number; rating: number; comment: string }, token: String) => {
    const response = await axios.post(`${BASE_URL}/foodratings`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Actualizar parcialmente una calificación
export const patchFoodRating = async (id: number, data: { rating?: number; comment?: string }, token: String) => {
    const response = await axios.patch(`${BASE_URL}/foodratings/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Actualizar completamente una calificación
export const updateFoodRating = async (id: number, data: { rating: number; comment: string }, token: String) => {
    const response = await axios.put(`${BASE_URL}/foodratings/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Eliminar una calificación por su ID
export const deleteFoodRating = async (id: number, token: String) => {
    const response = await axios.delete(`${BASE_URL}/foodratings/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener todas las calificaciones hechas por un usuario
export const getFoodRatingsByUserId = async (userId: number, token: String) => {
    const response = await axios.get(`${BASE_URL}/foodratings/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Obtener todos los comentarios de un platillo específico
export const getCommentsByFoodId = async (foodId: number, token: String) => {
    const response = await axios.get(`${BASE_URL}/foodratings/foods/${foodId}/comments`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
