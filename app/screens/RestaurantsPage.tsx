import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { getAllRestaurants, deleteRestaurant, createRestaurant, updateRestaurant } from "@/api/restaurantApi";
import { useAuth } from "../useAuth"; // Importa el hook useAuth
import { MaterialIcons } from '@expo/vector-icons'; // Icono de editar

const RestaurantsPage = () => {
  const router = useRouter();
  const { token, user, loading } = useAuth(); // Utiliza el hook useAuth para acceder al token y usuario

  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    email: "",
    latitude: "",
    longitude: "",
    status: "OPEN",
    image: null,
  });

  // Fetch restaurants
  useEffect(() => {
    if (!token) return;  // Si no hay token, no realizamos la solicitud
    const fetchRestaurants = async () => {
      try {
        const fetchedRestaurants = await getAllRestaurants(token);
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, [token]); // Solo se ejecuta cuando el token cambia

  const handleDelete = async (id: number) => {
    try {
      await deleteRestaurant(id, token);
      setRestaurants((prev) => prev.filter((r) => r.restaurantId !== id));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const handleEdit = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setRestaurantData({
      name: restaurant.name,
      email: restaurant.email,
      latitude: restaurant.latitude.toString(),
      longitude: restaurant.longitude.toString(),
      status: restaurant.status,
      image: restaurant.image || null, // Manejamos la imagen aquí
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        name: restaurantData.name,
        email: restaurantData.email,
        latitude: parseFloat(restaurantData.latitude),
        longitude: parseFloat(restaurantData.longitude),
        status: restaurantData.status,
        image: restaurantData.image,
      };

      if (selectedRestaurant) {
        const updatedRestaurant = await updateRestaurant(selectedRestaurant.restaurantId, data, token);
        setRestaurants((prev) =>
          prev.map((r) => (r.restaurantId === updatedRestaurant.restaurantId ? updatedRestaurant : r))
        );
      } else {
        const newRestaurant = await createRestaurant(data, token);
        setRestaurants((prev) => [newRestaurant, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving restaurant:", error);
    }
  };

  const renderRestaurant = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Cargar imagen usando Image */}
      <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>Lat: {item.latitude}</Text>
        <Text style={styles.cardText}>Long: {item.longitude}</Text>
        <Text style={styles.cardText}>Email: {item.email}</Text>
        <Text style={styles.cardText}>
          Estado:{" "}
          <Text style={item.status === "OPEN" ? styles.statusOpen : styles.statusClosed}>
            {item.status === "OPEN" ? "Abierto" : "Cerrado"}
          </Text>
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
          <MaterialIcons name="edit" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.restaurantId)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Restaurantes</Text>
        <TouchableOpacity onPress={() => setIsModalOpen(true)} style={styles.newRestaurantButton}>
          <Text style={styles.newRestaurantButtonText}>+ Nuevo Restaurante</Text>
        </TouchableOpacity>
      </View>

      {/* Restaurant List */}
      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.restaurantId.toString()}
      />

      {/* Modal for editing */}
      {isModalOpen && (
        <Modal
          visible={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedRestaurant ? "Editar Restaurante" : "Nuevo Restaurante"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={restaurantData.name}
              onChangeText={(text) => setRestaurantData({ ...restaurantData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={restaurantData.email}
              onChangeText={(text) => setRestaurantData({ ...restaurantData, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Latitud"
              value={restaurantData.latitude}
              onChangeText={(text) => setRestaurantData({ ...restaurantData, latitude: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Longitud"
              value={restaurantData.longitude}
              onChangeText={(text) => setRestaurantData({ ...restaurantData, longitude: text })}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() => setRestaurantData({ ...restaurantData, status: restaurantData.status === "OPEN" ? "CLOSED" : "OPEN" })}
              style={styles.statusButton}
            >
              <Text style={styles.statusButtonText}>
                Cambiar estado a {restaurantData.status === "OPEN" ? "Cerrado" : "Abierto"}
              </Text>
            </TouchableOpacity>
            <Button title="Guardar" onPress={handleSave} />
            <Button title="Cancelar" onPress={() => setIsModalOpen(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  newRestaurantButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 5,
  },
  newRestaurantButtonText: {
    color: "#333",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#333",
    borderWidth: 1,
  },
  actionButtonText: {
    color: "#333",
    fontSize: 14,
  },
  statusOpen: {
    color: "green",
  },
  statusClosed: {
    color: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  statusButton: {
    padding: 10,
    backgroundColor: "#FFC107",
    borderRadius: 5,
    marginBottom: 15,
  },
  statusButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});

export default RestaurantsPage;
