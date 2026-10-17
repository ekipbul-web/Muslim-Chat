import { Tabs } from "expo-router";
import { MessageCircle, Users, CircleDot, Settings, Megaphone } from "lucide-react-native";
import { Platform, useColorScheme } from "react-native";

export default function TabsLayout() {
  const isDark = useColorScheme() === "dark";
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#0F766E", tabBarInactiveTintColor: isDark ? "#64748B" : "#94A3B8", tabBarStyle: { backgroundColor: isDark ? "#1E293B" : "#ffffff", borderTopWidth: 1, borderTopColor: isDark ? "#334155" : "#F1F5F9", height: Platform.OS === "ios" ? 88 : 70, paddingBottom: Platform.OS === "ios" ? 28 : 10, paddingTop: 10, elevation: 0 }, tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 4 } }}>
      <Tabs.Screen name="chats" options={{ title: "Sohbetler", tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size || 24} /> }} />
      <Tabs.Screen name="channels" options={{ title: "Kanallar", tabBarIcon: ({ color, size }) => <Megaphone color={color} size={size || 24} /> }} />
      <Tabs.Screen name="contacts" options={{ title: "Kişiler", tabBarIcon: ({ color, size }) => <Users color={color} size={size || 24} /> }} />
      <Tabs.Screen name="status" options={{ title: "Durum", tabBarIcon: ({ color, size }) => <CircleDot color={color} size={size || 24} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Profil", tabBarIcon: ({ color, size }) => <Settings color={color} size={size || 24} /> }} />
    </Tabs>
  );
}
