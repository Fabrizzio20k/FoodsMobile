import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";  // Importa el manipulator
import { useRouter } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";  // Importamos las funciones necesarias
import axios from "axios";
import { BASE_URL } from "../Api";
import { JwtAuthResponse } from "@/api/registerAndLoginApi";

// Función de registro
export const register = async (formData: FormData): Promise<JwtAuthResponse> => {
    try {
        const response = await axios.post<JwtAuthResponse>(`${BASE_URL}/auth/register`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error al registrarse:", error);
            throw error.response?.data?.message || "Error desconocido durante el registro";
        } else {
            console.error("Error inesperado:", error);
            throw "Error desconocido durante el registro";
        }
    }
};

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState<{ uri: string } | null>(null);
    const [userType, setUserType] = useState<"CONSUMER" | "INFLUENCER">("CONSUMER");
    const [isLoading, setIsLoading] = useState(false);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [galleryPermission, setGalleryPermission] = useState(false);
    const [cameraFacing, setCameraFacing] = useState<CameraType>("back");

    // Crear la referencia a la cámara
    const cameraRef = useRef<CameraView>(null);

    // Verificar si tenemos permisos para la cámara
    if (!cameraPermission) {
        return <View />;
    }

    if (!cameraPermission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestCameraPermission} title="grant permission" />
            </View>
        );
    }

    // Función para cambiar la cámara entre "delante" y "detrás"
    const toggleCameraFacing = () => {
        setCameraFacing((current) => (current === "back" ? "front" : "back"));
    };

    // Función para capturar la foto
    const capturePhoto = async () => {
        if (cameraPermission.granted) {
            const camera = cameraRef.current;
            if (camera) {
                // Intentar tomar la foto
                const photo = await camera.takePictureAsync({
                    quality: 0.7,
                    base64: true,
                });
                if (photo && photo.uri) {
                    const manipulatedPhoto = await ImageManipulator.manipulateAsync(
                        photo.uri,
                        [],
                        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    console.log("Foto capturada:", manipulatedPhoto.uri);
                    setProfilePicture(manipulatedPhoto);
                } else {
                    console.error("Error: No se pudo tomar la foto.");
                    Alert.alert("Error", "No se pudo tomar la foto.");
                }
            }
        }
    };

    // Función para seleccionar una imagen de la galería
    const pickImage = async () => {
        // Verificar los permisos de galería
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const manipulatedPhoto = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [],
                    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                );
                setProfilePicture(manipulatedPhoto);
            } else {
                console.log("No se seleccionó ninguna imagen.");
            }
        } else {
            Alert.alert("Permiso de galería denegado", "Por favor permite el acceso a la galería.");
        }
    };

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

            if (profilePicture) {
                const uri = profilePicture.uri;
                const response = await fetch(uri);
                const blob = await response.blob();

                const file = {
                    uri: uri,
                    name: "profile.jpg",
                    type: "image/jpeg",
                };

                formData.append("profilePicture", file as any);
            }

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

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                <Text style={styles.imagePickerText}>
                    {profilePicture ? "Cambiar Imagen de Perfil" : "Elegir Imagen de Perfil desde Galería"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imagePicker} onPress={capturePhoto}>
                <Text style={styles.imagePickerText}>Tomar Foto de Perfil</Text>
            </TouchableOpacity>

            {profilePicture && (
                <Image source={{ uri: profilePicture.uri }} style={styles.imagePreview} />
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

            <CameraView style={styles.camera} facing={cameraFacing} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Cambiar Cámara</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
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
    camera: { flex: 1 },
    buttonContainer: { position: "absolute", bottom: 20, left: 20, right: 20, flexDirection: "row" },
    button: { flex: 1, alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10 },
    text: { fontSize: 20, color: "white" },
    message: { fontSize: 16, color: "red", textAlign: "center", marginBottom: 20 },
});
