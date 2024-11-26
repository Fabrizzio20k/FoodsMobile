import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "../Api";
import { useAuth } from "../useAuth";

export default function LoginScreen() {
    const router = useRouter();
    const { setToken, setUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor completa todos los campos.");
            return;
        }

        setIsLoading(true);

        try {
            const loginReq = { email, password };
            const response = await login(loginReq);

            // Guardar token y usuario en el contexto
            setToken(response.token);
            setUser(response.user);

            Alert.alert("Éxito", "Inicio de sesión exitoso.");
            router.push("../screens/HomeLogged");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            Alert.alert("Error", "Credenciales incorrectas. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {isLoading ? (
                <ActivityIndicator size="large" color="#FFD700" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            )}

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => router.push("../screens/RegisterScreen")}>
                    <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("../screens/ForgotPasswordScreen")}>
                    <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "white",
    },
    button: {
        backgroundColor: "#FFD700",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 15,
    },
    buttonText: {
        fontWeight: "bold",
        color: "#333",
    },
    linksContainer: {
        alignItems: "center",
        marginTop: 10,
    },
    linkText: {
        color: "#007BFF",
        textDecorationLine: "underline",
        marginVertical: 5,
    },
});
