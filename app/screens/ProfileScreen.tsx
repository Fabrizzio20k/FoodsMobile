import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../useAuth"; // Asegúrate de importar el AuthProvider
import { useRouter } from "expo-router";

const ProfileScreen = () => {
  const { user, setToken, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        onPress: () => {
          setToken(null);
          setUser(null);
          router.replace("../screens/LoginScreen"); // Redirigir al inicio de sesión
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Editar Perfil", "Función para editar el perfil aún no implementada.");
  };

  return (
    <View style={styles.container}>
      {/* Botón de regresar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("../screens/HomeLogged")}
      >
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

      {/* Tarjeta del perfil */}
      <View style={styles.profileCard}>
        {/* Imagen del perfil */}
        <Image
          source={{
            uri: user?.profilePicture || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
        <Text style={styles.userEmail}>{user?.email || "usuario@correo.com"}</Text>

        {/* Información Personal */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>
            <Text style={styles.infoTitle}>Nombre:</Text> {user?.name || "No especificado"}
          </Text>
          <Text style={styles.infoLabel}>
            <Text style={styles.infoTitle}>Biografía:</Text> {user?.bio || "No especificada"}
          </Text>
          <Text style={styles.infoLabel}>
            <Text style={styles.infoTitle}>Rol:</Text> {user?.userType || "Sin rol"}
          </Text>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Fondo oscuro
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#DDD",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
    marginBottom: 15,
  },
  infoSection: {
    width: "100%",
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
  infoTitle: {
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  logoutButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
