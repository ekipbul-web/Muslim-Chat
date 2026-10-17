import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuthStore } from "@/store/authStore";
import { usePermissions } from "@/hooks/usePermissions";
import { Avatar } from "@/components/Avatar";
import { RoleBadge } from "@/components/RoleBadge";
import { supabase } from "@/lib/supabase";
import { LogOut, Shield, ChevronRight } from "lucide-react-native";

export default function Settings() {
  const profile = useAuthStore((s) => s.profile);
  const { isAssistant } = usePermissions();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView>
        <View className="px-4 py-4">
          <Text className="text-3xl font-bold text-slate-900 mb-6">
            Ayarlar
          </Text>

          <Animated.View
            entering={FadeInDown}
            className="bg-slate-50 rounded-3xl p-5 flex-row items-center"
          >
            <Avatar
              uri={profile?.avatar_url}
              name={profile?.full_name}
              size={64}
              role={profile?.role}
            />
            <View className="ml-4 flex-1">
              <Text className="font-bold text-lg text-slate-900">
                {profile?.full_name}
              </Text>
              <Text className="text-slate-500">@{profile?.username}</Text>
              {profile?.role && profile.role !== "user" ? (
                <View className="mt-1 flex-row">
                  <RoleBadge role={profile.role} />
                </View>
              ) : null}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} className="mt-6">
            <Pressable
              onPress={handleLogout}
              className="bg-red-50 rounded-3xl p-5 flex-row items-center"
            >
              <LogOut color="#DC2626" size={24} />
              <Text className="ml-3 text-red-600 font-bold text-base">
                Çıkış Yap
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
