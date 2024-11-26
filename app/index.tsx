import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <ImageBackground
            source={require("../assets/background.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>¡Bienvenido a FoodTails!</Text>
                    <Text style={styles.subtitle}>
                        La red social para amantes de la comida. Comparte experiencias y encuentra los mejores lugares para comer.
                    </Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.registerButton]}
                            onPress={() => router.push("../screens/RegisterScreen")}
                        >
                            <Text style={styles.buttonText}>¡Regístrate ahora!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.loginButton]}
                            onPress={() => router.push("../screens/LoginScreen")}
                        >
                            <Text style={styles.buttonText}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, justifyContent: "center" },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
    card: {
        width: "90%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
    buttons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
    button: { padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5 },
    registerButton: { backgroundColor: "#FFD700" },
    loginButton: { backgroundColor: "#333" },
    buttonText: { textAlign: "center", color: "white", fontWeight: "bold" },
});
