import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { View, ActivityIndicator, useColorScheme } from "react-native";

export default function RootLayout() {
  const { loading } = useAuth();
  const colorScheme = useColorScheme();
  if (loading) return (<View className="flex-1 items-center justify-center bg-white dark:bg-slate-900"><ActivityIndicator size="large" color="#0F766E" /></View>);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", contentStyle: { backgroundColor: colorScheme === "dark" ? "#0F172A" : "#F8FAFC" } }}>
          <Stack.Screen name="index" /><Stack.Screen name="(auth)" /><Stack.Screen name="(tabs)" /><Stack.Screen name="chat/[id]" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
