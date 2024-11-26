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
import { useRouter } from "expo-router";
import { register } from "../Api";

export default function RegisterScreen() {
    const router = useRouter();

    // Cambiar el tipo de profilePicture
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [userType, setUserType] = useState<"CONSUMER" | "INFLUENCER">("CONSUMER");
    const [isLoading, setIsLoading] = useState(false);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setProfilePicture(result.assets[0]); // Almacenar el objeto seleccionado
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
                const response = await fetch(profilePicture.uri);
                const blob = await response.blob();
                formData.append("profilePicture", blob, "profile.jpg");
            }

            await register(formData);
            Alert.alert("Éxito", "¡Registro exitoso!");
            router.push("../screens/LoginScreen");
        } catch (error) {
            console.error(error);
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
