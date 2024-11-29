import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../useAuth";
import { useRouter } from "expo-router";
import { BASE_URL } from "@/app/Api";
import { User } from "@/api/registerAndLoginApi";
import axios from 'axios';
import { Accelerometer } from "expo-sensors"; // Importamos el acelerómetro

const ProfileScreen = () => {
  const { token, user, setToken, setUser } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState(user);
  const [profilePicture, setProfilePicture] = useState<ImagePicker.ImagePickerAsset | null>(null);

  // Estado para almacenar los valores del acelerómetro
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Suscribirse al acelerómetro para obtener los valores de aceleración
    const subscription = Accelerometer.addListener((accelData) => {
      setAcceleration(accelData);
    });

    // Limpiar cuando el componente se desmonte
    return () => subscription.remove();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfilePicture(result.assets[0]);
    }
  };

  const handleSaveChanges = async () => {
    if (!token) {
      Alert.alert("Error", "No se pudo obtener el token de autenticación.");
      return;
    }

    if (!user || !user.userId) {
      Alert.alert("Error", "No se pudo obtener el ID del usuario.");
      return;
    }

    const formData = new FormData();

    if (editedUserData) {
      const userDataBlob = new Blob(
        [JSON.stringify({ name: editedUserData.name, bio: editedUserData.bio })],
        { type: "application/json" }
      );

      formData.append("user", userDataBlob);
    } else {
      Alert.alert("Error", "No se pudo obtener los datos del usuario editado.");
      return;
    }

    if (profilePicture) {
      try {
        const uri = profilePicture.uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = {
          uri: uri,
          name: "profile_update.jpg",
          type: "image/jpeg",
        };
        formData.append("image", file as any);
      } catch (error) {
        console.error("Error al procesar la imagen:", error);
        Alert.alert("Error", "Hubo un problema al procesar la imagen.");
        return;
      }
    }

    try {
      console.log("Enviando datos de perfil actualizados:", formData.get("user"));
      const response = await axios.put(`${BASE_URL}/users/${user.userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Perfil actualizado con éxito:", response.data);
      setUser(response.data);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al actualizar el perfil:", error);
        Alert.alert("Error", `Hubo un problema al actualizar el perfil. ${error.response?.data?.message || 'Intenta de nuevo.'}`);
      } else {
        console.error("Error inesperado:", error);
        Alert.alert("Error", "Hubo un problema al actualizar el perfil. Intenta de nuevo.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedUserData(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        onPress: () => {
          setToken(null);
          setUser(null);
          router.replace("../screens/LoginScreen");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("../screens/HomeLogged")}
      >
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

      <View style={styles.profileCard}>
        <Image
          source={{
            uri: user?.profilePicture || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
        <Text style={styles.userEmail}>{user?.email || "usuario@correo.com"}</Text>

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

        {/* Mostrar los valores del acelerómetro */}
        <View style={styles.accelerationSection}>
          <Text style={styles.accelerationLabel}>Acelerómetro:</Text>
          <Text style={styles.accelerationValue}>X: {acceleration.x.toFixed(2)}</Text>
          <Text style={styles.accelerationValue}>Y: {acceleration.y.toFixed(2)}</Text>
          <Text style={styles.accelerationValue}>Z: {acceleration.z.toFixed(2)}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isEditing && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={editedUserData?.name || ""}
              onChangeText={(text) => setEditedUserData({ ...editedUserData, name: text } as User)}
            />

            <TextInput
              style={styles.input}
              placeholder="Biografía"
              value={editedUserData?.bio || ""}
              onChangeText={(text) => setEditedUserData({ ...editedUserData, bio: text } as User)}
              multiline
            />

            <TouchableOpacity
              style={styles.selectImageButton}
              onPress={handleImagePick}
            >
              <Text style={styles.selectImageButtonText}>Seleccionar Foto de Perfil</Text>
            </TouchableOpacity>

            {profilePicture && (
              <Image
                source={{ uri: profilePicture.uri }}
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
  accelerationSection: {
    marginTop: 20,
    paddingLeft: 10,
  },
  accelerationLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  accelerationValue: {
    fontSize: 16,
    marginBottom: 5,
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
