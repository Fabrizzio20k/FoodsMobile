import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../useAuth"; // Asegúrate de que esté bien importado
import { useRouter } from "expo-router";
import { BASE_URL } from "@/app/Api"; // Asegúrate de que el BASE_URL está configurado correctamente

const ProfileScreen = () => {
  const { token, user, setToken, setUser } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false); // Para controlar la vista de edición
  const [editedUserData, setEditedUserData] = useState(user); // Datos del perfil que se editarán
  const [newImage, setNewImage] = useState<string | null>(null); // Para almacenar la nueva imagen seleccionada

  // Función para manejar la selección de imagen
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permiso denegado", "Necesitamos permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      const { uri, type, size } = result.assets[0];

      // Verificar el tipo de archivo detectado
      const fileExtension = uri.split(".").pop()?.toLowerCase();
      if (fileExtension !== "jpg" && fileExtension !== "jpeg") {
        Alert.alert("Error", "Por favor selecciona una imagen en formato .jpg o .jpeg.");
        return;
      }

      // Verificar que el tamaño de la imagen no exceda los 2 MB
      if (size > 2 * 1024 * 1024) {
        Alert.alert("Error", "La imagen debe ser menor a 2 MB.");
        return;
      }

      // Si la imagen es válida, actualizar el estado
      setNewImage(uri); // Almacenamos la nueva imagen seleccionada
    }
  };

  // Función para guardar los cambios
  const handleSaveChanges = async () => {
    if (!token) {
      Alert.alert("Error", "No se pudo obtener el token de autenticación.");
      return;
    }

    const userId = user?.id; // Asumiendo que el usuario tiene un ID

    const formData = new FormData();

    // Adjuntar los datos del perfil (nombre, biografía)
    formData.append("user", JSON.stringify({
      name: editedUserData.name,
      bio: editedUserData.bio,
    }));

    // Adjuntar la nueva imagen si se ha seleccionado una
    if (newImage) {
      formData.append("image", {
        uri: newImage,
        name: "profile-picture.jpg", // Nombre del archivo de imagen
        type: "image/jpeg", // Tipo de archivo
      });
    }

    try {
      // Hacer la petición PUT al backend para actualizar el perfil
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Actualiza el estado con los nuevos datos
      setIsEditing(false); // Cierra el modal de edición

      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el perfil");
    }
  };

  // Función para cancelar los cambios
  const handleCancelEdit = () => {
    setEditedUserData(user); // Restaurar los datos del perfil original
    setIsEditing(false); // Cerrar el modal sin guardar cambios
  };

  // Función para manejar el logout
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
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)} // Activar el modal de edición
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de edición */}
      {isEditing && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            {/* Campo de Nombre */}
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={editedUserData.name}
              onChangeText={(text) => setEditedUserData({ ...editedUserData, name: text })}
            />

            {/* Campo de Biografía */}
            <TextInput
              style={styles.input}
              placeholder="Biografía"
              value={editedUserData.bio}
              onChangeText={(text) => setEditedUserData({ ...editedUserData, bio: text })}
              multiline
            />

            {/* Selección de Imagen */}
            <TouchableOpacity
              style={styles.selectImageButton}
              onPress={handlePickImage}
            >
              <Text style={styles.selectImageButtonText}>Seleccionar Foto de Perfil</Text>
            </TouchableOpacity>

            {/* Mostrar la imagen seleccionada */}
            {newImage && (
              <Image
                source={{ uri: newImage }}
                style={styles.selectedImage}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    paddingTop: 40,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  profileCard: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    color: "#777",
  },
  infoSection: {
    marginTop: 20,
    alignSelf: "flex-start",
    paddingLeft: 10,
  },
  infoLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoTitle: {
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    width: "100%",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  selectImageButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  selectImageButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
});

export default ProfileScreen;
