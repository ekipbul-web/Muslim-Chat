import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { usePermissions } from "@/hooks/usePermissions";
import { Avatar } from "@/components/Avatar";
import { RoleBadge } from "@/components/RoleBadge";
import { supabase } from "@/lib/supabase";
import { LogOut, Shield, ChevronRight, Edit3, Settings as SettingsIcon } from "lucide-react-native";

export default function Settings() {
  const profile = useAuthStore((s) => s.profile);
  const { isAssistant } = usePermissions();
  const handleLogout = async () => { await supabase.auth.signOut(); router.replace("/(auth)/login"); };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView className="flex-1">
        <View className="bg-white px-6 pt-6 pb-8 rounded-b-[40px] shadow-sm shadow-slate-200 mb-6">
          <Text className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Profil</Text>
          <View className="flex-row items-center">
            <Avatar uri={profile?.avatar_url} name={profile?.full_name} size={80} role={profile?.role} />
            <View className="ml-5 flex-1">
              <Text className="font-extrabold text-2xl text-slate-900">{profile?.full_name || "İsimsiz Kullanıcı"}</Text>
              <Text className="text-slate-500 font-medium text-base mb-2">@{profile?.username || "kullanici"}</Text>
              {profile?.role && profile.role !== "user" ? <View className="flex-row"><RoleBadge role={profile.role} /></View> : null}
            </View>
          </View>
          {profile?.bio ? <Text className="text-slate-600 mt-4 text-sm leading-5">{profile.bio}</Text> : null}
        </View>
        <View className="px-4">
          <Pressable onPress={() => router.push("/profile/edit")} className="bg-white rounded-3xl p-5 flex-row items-center shadow-sm shadow-slate-200 mb-3"><View className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center"><Edit3 color="#475569" size={24} /></View><View className="ml-4 flex-1"><Text className="font-bold text-slate-900 text-base">Profili Düzenle</Text><Text className="text-slate-500 text-sm">Bilgilerini ve fotoğrafını güncelle</Text></View><ChevronRight color="#CBD5E1" size={24} /></Pressable>
          {isAssistant && (
            <Pressable onPress={() => router.push("/(admin)/dashboard")} className="bg-white rounded-3xl p-5 flex-row items-center shadow-sm shadow-slate-200 mb-3"><View className="w-12 h-12 rounded-2xl bg-primary-50 items-center justify-center"><Shield color="#0F766E" size={24} /></View><View className="ml-4 flex-1"><Text className="font-bold text-slate-900 text-base">Yönetim Paneli</Text><Text className="text-slate-500 text-sm">Sistem yetkileri</Text></View><ChevronRight color="#CBD5E1" size={24} /></Pressable>
          )}
          <Pressable onPress={handleLogout} className="bg-white rounded-3xl p-5 flex-row items-center shadow-sm shadow-slate-200 mt-4"><View className="w-12 h-12 rounded-2xl bg-red-50 items-center justify-center"><LogOut color="#DC2626" size={24} /></View><View className="ml-4 flex-1"><Text className="font-bold text-red-600 text-base">Çıkış Yap</Text></View></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
