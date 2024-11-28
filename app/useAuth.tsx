import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import * as SecureStore from 'expo-secure-store';
import { User } from "@/api/registerAndLoginApi";

interface AuthContextType {
    token: string | null;
    user: User | null;
    loading: boolean;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync("authToken");
                const storedUser = await SecureStore.getItemAsync("authUser");

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Error al cargar los datos de autenticación:", error);
            } finally {
                setLoading(false);
            }
        };

        loadStoredData();
    }, []);

    useEffect(() => {
        const storeToken = async () => {
            if (token) {
                await SecureStore.setItemAsync("authToken", token);
            } else {
                await SecureStore.deleteItemAsync("authToken");
            }
        };

        storeToken();
    }, [token]);

    useEffect(() => {
        const storeUser = async () => {
            if (user) {
                await SecureStore.setItem("authUser", JSON.stringify(user));
            } else {
                await SecureStore.deleteItemAsync("authUser");
            }
        };

        storeUser();
    }, [user]);

    return (
        <AuthContext.Provider value={{ token, user, loading, setToken, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};

// Helper para decodificar un token JWT
const parseJwt = (token: string): any => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(
            decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => {
                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join("")
            )
        );
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
};
