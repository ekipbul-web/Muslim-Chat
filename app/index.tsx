import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function Index() {
  const profile = useAuthStore((s) => s.profile);
  if (profile) return <Redirect href="/(tabs)/chats" />;
  return <Redirect href="/(auth)/login" />;
}
