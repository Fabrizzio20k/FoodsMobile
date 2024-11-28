import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { getAllRestaurants, deleteRestaurant, createRestaurant, updateRestaurant } from "@/api/restaurantApi";  // Agregamos la función getPlatillosByRestaurant
import { useAuth } from "../useAuth"; // Importa el hook useAuth
import { MaterialIcons } from '@expo/vector-icons'; // Icono de editar
//import MapView, { Marker } from "react-native-maps"; // Importar MapView y Marker

export default function RestaurantsPage() {
  const router = useRouter();
  const { token, user, loading } = useAuth(); // Utiliza el hook useAuth para acceder al token y usuario

  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Para el modal de detalles
  const [isPlatillosModalOpen, setIsPlatillosModalOpen] = useState(false); // Para el modal de platillos
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    email: "",
    latitude: "",
    longitude: "",
    status: "OPEN",
    image: null,
  });
  const [platillos, setPlatillos] = useState([]); // Nuevo estado para los platillos

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

  const handleViewDetails = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setIsDetailsModalOpen(true);
  };

  // Nueva función para obtener los platillos de un restaurante
  const handleViewPlatillos = async (restaurantId: number) => {
    try {
      const fetchedPlatillos = await getPlatillosByRestaurant(restaurantId, token); // Llamamos a la API
      setPlatillos(fetchedPlatillos);
      setIsPlatillosModalOpen(true);
    } catch (error) {
      console.error("Error fetching platillos:", error);
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
        {/* Ícono de Editar en la esquina superior izquierda */}
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButtonLeft}>
          <MaterialIcons name="edit" size={24} color="#333" />
        </TouchableOpacity>

        {/* Ícono de Borrar en la esquina superior derecha */}
        <TouchableOpacity onPress={() => handleDelete(item.restaurantId)} style={styles.actionButtonRight}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomActions}>
        {/* Ver Platillos */}
        <TouchableOpacity onPress={() => handleViewPlatillos(item.restaurantId)} style={styles.actionButton}>
          <MaterialIcons name="restaurant" size={24} color="#333" />
          <Text style={styles.actionText}>Ver Platillos</Text>
        </TouchableOpacity>

        {/* Ver Detalles */}
        <TouchableOpacity onPress={() => handleViewDetails(item)} style={styles.actionButton}>
          <MaterialIcons name="visibility" size={24} color="#333" />
          <Text style={styles.actionText}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}


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
              style={styles.statusButton}
              onPress={() =>
                setRestaurantData({
                  ...restaurantData,
                  status: restaurantData.status === "OPEN" ? "CLOSED" : "OPEN",
                })
              }
            >
              <Text style={styles.statusButtonText}>
                {restaurantData.status === "OPEN" ? "Cambiar a Cerrado" : "Cambiar a Abierto"}
              </Text>
            </TouchableOpacity>

            <Button title="Guardar" onPress={handleSave} />
          </View>
        </Modal>
      )}

      {/* Modal para ver los platillos */}
      {isPlatillosModalOpen && (
        <Modal
          visible={isPlatillosModalOpen}
          onRequestClose={() => setIsPlatillosModalOpen(false)}
          animationType="slide"
        >
          <View style={styles.detailsModalContainer}>
            <View style={styles.detailsModalContent}>
              <Text style={styles.modalTitle}>Platillos de {selectedRestaurant?.name}</Text>

              {/* Mostrar los platillos */}
              <FlatList
                data={platillos}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardText}>Precio: {item.price}</Text>
                    <Text style={styles.cardText}>Descripción: {item.description}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />

              <TouchableOpacity onPress={() => setIsPlatillosModalOpen(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal para ver los detalles del restaurante */}
      {isDetailsModalOpen && (
        <Modal
          visible={isDetailsModalOpen}
          onRequestClose={() => setIsDetailsModalOpen(false)}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.detailsModalContainer}>
            <View style={styles.detailsModalContent}>
              <Text style={styles.modalTitle}>{selectedRestaurant?.name}</Text>
              <Image
                source={{ uri: selectedRestaurant?.image || "https://via.placeholder.com/150" }}
                style={styles.image}
              />
              <Text style={styles.cardText}>Email: {selectedRestaurant?.email}</Text>
              <Text style={styles.cardText}>Latitud: {selectedRestaurant?.latitude}</Text>
              <Text style={styles.cardText}>Longitud: {selectedRestaurant?.longitude}</Text>
              <Text style={styles.cardText}>
                Estado:{" "}
                <Text style={selectedRestaurant?.status === "OPEN" ? styles.statusOpen : styles.statusClosed}>
                  {selectedRestaurant?.status === "OPEN" ? "Abierto" : "Cerrado"}
                </Text>
              </Text>

              {/* Mapa de Google */}
              <MapView
                style={styles.map}
                region={{
                  latitude: parseFloat(selectedRestaurant?.latitude || "0"),
                  longitude: parseFloat(selectedRestaurant?.longitude || "0"),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker coordinate={{ latitude: parseFloat(selectedRestaurant?.latitude || "0"), longitude: parseFloat(selectedRestaurant?.longitude || "0") }} />
              </MapView>

              <TouchableOpacity onPress={() => setIsDetailsModalOpen(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Agregar los estilos necesarios para el nuevo modal de platillos y otros elementos relacionados
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
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButtonLeft: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#333",
    borderWidth: 1,
  },
  actionButtonRight: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#333",
    borderWidth: 1,
  },
  bottomActions: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#333",
    borderWidth: 1,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
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
  floatingButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#FFC107",
    borderRadius: 50,
    padding: 15,
    elevation: 10,
  },
  detailsModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  detailsModalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
});
