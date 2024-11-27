import { Stack } from "expo-router";
import { AuthProvider } from "@/app/useAuth"; // Asegúrate de usar el correcto (AsyncStorage)

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
