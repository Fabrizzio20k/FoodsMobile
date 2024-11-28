import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";  // Importa el manipulator
import { useRouter } from "expo-router";
import axios from "axios";

const BASE_URL = "https://your-api-url.com"; // Reemplaza con la URL de tu API

// Función de registro
export const register = async (formData: FormData): Promise<any> => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/register`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Detalles completos del error de Axios
            console.error("Error al registrarse:", error);

            // Ver más detalles del error
            if (error.response) {
                console.error("Error response status:", error.response.status);
                console.error("Error response data:", error.response.data);
                console.error("Error response headers:", error.response.headers);
            } else if (error.request) {
                console.error("Error request:", error.request);
            } else {
                console.error("Error message:", error.message);
            }

            throw error.response?.data?.message || "Error desconocido durante el registro";
        } else {
            console.error("Error inesperado:", error);
            throw "Error desconocido durante el registro";
        }
    }
};

export default function RegisterScreen() {
    const router = useRouter();

    // Estados para los campos del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [userType, setUserType] = useState<"CONSUMER" | "INFLUENCER">("CONSUMER");
    const [isLoading, setIsLoading] = useState(false);

    // Función para manejar la selección de imagen
    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            // Convertir la imagen a formato JPG
            const manipResult = await ImageManipulator.manipulateAsync(
                asset.uri,
                [], // No cambiar tamaño, solo formato
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG } // Convertir a JPG
            );

            console.log("Imagen convertida a JPG:", manipResult.uri); // Verificar la URI de la imagen convertida

            // Guardar la imagen convertida en el estado
            setProfilePicture(manipResult);
        }
    };

    // Función de registro con FormData
    const handleRegister = async () => {
        if (!email || !password || !name || !bio) {
            Alert.alert("Error", "Por favor completa todos los campos.");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            formData.append("name", name);
            formData.append("bio", bio);
            formData.append("userType", userType);

            // Si se seleccionó una imagen de perfil
            if (profilePicture) {
                const uri = profilePicture.uri;

                // Obtener la imagen como un "blob" usando fetch
                const response = await fetch(uri);
                const blob = await response.blob();

                // Crear un objeto de tipo `File` con el blob obtenido
                const file = {
                    uri: uri,
                    name: "profile.jpg",  // Renombrar el archivo para que sea un JPG
                    type: "image/jpeg",   // Especificar el tipo de archivo
                };

                // Agregar el archivo al FormData con el nombre correcto
                formData.append("profilePicture", file as any);
            }

            // Verifica los datos que estás enviando
            console.log("Datos FormData: ", formData);

            // Hacer la solicitud
            await register(formData);  // Llamar a la función de registro
            Alert.alert("Éxito", "¡Registro exitoso!");
            router.push("../screens/LoginScreen");
        } catch (error) {
            console.error("Error en el registro:", error);
            Alert.alert("Error", "Hubo un problema al registrarse. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Regístrate</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Bio"
                multiline
                value={bio}
                onChangeText={setBio}
            />

            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                <Text style={styles.imagePickerText}>
                    {profilePicture ? "Cambiar Imagen de Perfil" : "Subir Imagen de Perfil"}
                </Text>
            </TouchableOpacity>

            {profilePicture && (
                <Image
                    source={{ uri: profilePicture.uri }}
                    style={styles.imagePreview}
                />
            )}

            <View style={styles.userTypeContainer}>
                <TouchableOpacity
                    style={[styles.userTypeButton, userType === "CONSUMER" && styles.activeButton]}
                    onPress={() => setUserType("CONSUMER")}
                >
                    <Text style={[styles.userTypeText, userType === "CONSUMER" && styles.activeText]}>
                        Consumidor
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.userTypeButton, userType === "INFLUENCER" && styles.activeButton]}
                    onPress={() => setUserType("INFLUENCER")}
                >
                    <Text style={[styles.userTypeText, userType === "INFLUENCER" && styles.activeText]}>
                        Influencer
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#FFD700" />
            ) : (
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Registrar</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => router.push("../screens/LoginScreen")}>
                <Text style={styles.loginLink}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "white",
    },
    textArea: { height: 80, textAlignVertical: "top" },
    imagePicker: {
        backgroundColor: "#FFD700",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 15,
    },
    imagePickerText: { fontWeight: "bold", color: "#333" },
    imagePreview: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
    userTypeContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
    userTypeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        flex: 1,
        marginHorizontal: 5,
        alignItems: "center",
    },
    activeButton: { backgroundColor: "#FFD700" },
    userTypeText: { fontWeight: "bold", color: "#333" },
    activeText: { color: "white" },
    registerButton: {
        backgroundColor: "#FFD700",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    registerButtonText: { fontWeight: "bold", color: "#333" },
    loginLink: {
        marginTop: 20,
        textAlign: "center",
        color: "#007BFF",
        textDecorationLine: "underline",
    },
});
