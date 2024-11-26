import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
  
  import { User } from "../api/registerAndLoginApi";
  import { BASE_URL } from "./Api";
  
  interface AuthContextType {
    token: string | null;
    user: User | null;
    loading: boolean;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));
    const [user, setUser] = useState<User | null>(() => {
      const storedUser = localStorage.getItem("authUser");
      return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState<boolean>(!token || !user);
  
    useEffect(() => {
      if (token && !user) {
        const userId = parseJwt(token)?.userId;
        if (userId) {
          fetch(`${BASE_URL}/users/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error al obtener los detalles del usuario.");
              }
              return response.json();
            })
            .then((userData: User) => {
              setUser(userData);
              localStorage.setItem("authUser", JSON.stringify(userData));
            })
            .catch((error) => {
              console.error("Error al restaurar el usuario:", error);
              setToken(null);
              localStorage.removeItem("authToken");
            })
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }, [token]);
  
    useEffect(() => {
      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }
    }, [token]);
  
    useEffect(() => {
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("authUser");
      }
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
      return JSON.parse(decodeURIComponent(atob(base64).split("").map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join("")));
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };
  