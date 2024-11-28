import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Navegación
import { FontAwesome5 } from '@expo/vector-icons'; // Importamos los íconos
import RestaurantsPage from "@/app/screens/RestaurantsPage"; // Importamos la sección de restaurantes

export default function HomeLogged() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Barra de navegación superior */}
            <View style={styles.navbar}>
                <Text style={styles.navbarText}>FoodTales</Text>
            </View>

            {/* Sección de Restaurantes - Vista previa */}
            <View style={styles.content}>
                <Text style={styles.mainText}>Descubre los mejores restaurantes</Text>
                <RestaurantsPage /> {/* Aquí incrustamos el componente RestaurantsPage como una vista previa */}
            </View>

            {/* Navbar Inferior con iconos */}
            <View style={styles.navbarBottom}>
                <TouchableOpacity
                    style={styles.navbarItem}
                    onPress={() => router.push("../screens/PostsScreen")}
                >
                    <FontAwesome5 name="newspaper" size={24} color="#333" />
                    <Text style={styles.navbarItemText}>Publicaciones</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navbarItem}
                    onPress={() => router.push("../screens/RestaurantsPage")}
                >
                    <FontAwesome5 name="utensils" size={24} color="#333" />
                    <Text style={styles.navbarItemText}>Restaurantes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navbarItem}
                    onPress={() => router.push("../screens/ProfileScreen")}
                >
                    <FontAwesome5 name="user-circle" size={24} color="#333" />
                    <Text style={styles.navbarItemText}>Perfil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    navbar: {
        height: 60,
        backgroundColor: "#FFD700",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    navbarText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    content: {
        flex: 1,
        padding: 20,
    },
    mainText: {
        fontSize: 18,
        color: "#333",
        textAlign: "center",
        marginTop: 40,
    },
    navbarBottom: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        backgroundColor: "#FFD700",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    navbarItem: {
        justifyContent: "center",
        alignItems: "center",
    },
    navbarItemText: {
        fontSize: 12,
        color: "#333",
        marginTop: 4,
    },
});
