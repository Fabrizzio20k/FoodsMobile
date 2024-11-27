import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { useAuth } from "../useAuth";
import { useRouter } from "expo-router"; // Navegación

export default function HomeLogged() {
    const { user } = useAuth(); // Obtener el usuario autenticado
    const router = useRouter();

    return (
        <ImageBackground
            source={require("../../assets/background.png")}
            style={styles.background}
        >
            {/* Superposición de fondo */}
            <View style={styles.overlay} />

            {/* Contenido principal */}
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>
                        Bienvenido, {user?.name || "Usuario"}!
                    </Text>
                    <Text style={styles.subText}>
                        Explora, comparte y conecta con otros amantes de la comida.
                    </Text>
                </View>

                {/* Tarjetas */}
                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push("../screens/PostsScreen")}
                    >
                        <Text style={styles.cardTitle}>Publicaciones</Text>
                        <Text style={styles.cardText}>
                            Crea, edita y explora publicaciones sobre experiencias culinarias.
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push("../screens/RestaurantsPage")}
                    >
                        <Text style={styles.cardTitle}>Restaurantes</Text>
                        <Text style={styles.cardText}>
                            Descubre, califica y explora restaurantes cerca de ti.
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push("../screens/ProfileScreen")}
                    >
                        <Text style={styles.cardTitle}>Mi Perfil</Text>
                        <Text style={styles.cardText}>
                            Consulta y actualiza la información de tu perfil.
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Pie de página */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        © 2024 FoodTales. Todos los derechos reservados.
                    </Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, justifyContent: "center", alignItems: "center" },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    header: { marginBottom: 30, alignItems: "center" },
    welcomeText: { fontSize: 28, fontWeight: "bold", color: "#fff" },
    subText: { fontSize: 16, color: "#ccc", textAlign: "center", marginTop: 8 },
    cardContainer: { width: "100%" },
    card: {
        backgroundColor: "#FFD700",
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
    cardText: { fontSize: 14, color: "#333", marginTop: 5 },
    footer: { marginTop: 20 },
    footerText: { fontSize: 14, color: "#ccc", textAlign: "center" },
});
