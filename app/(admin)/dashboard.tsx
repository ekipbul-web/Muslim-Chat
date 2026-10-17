import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { usePermissions } from "@/hooks/usePermissions";
import { ShieldAlert, Users, FileWarning, Database, ArrowLeft } from "lucide-react-native";

export default function AdminDashboard() {
  const { role, isCurator, isTechnicalAdmin } = usePermissions();
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-slate-200">
        <Pressable onPress={() => router.back()} className="p-2 mr-2"><ArrowLeft color="#0F172A" size={24} /></Pressable>
        <Text className="text-2xl font-extrabold text-slate-900">Yönetim Paneli</Text>
      </View>
      <ScrollView className="p-4">
        <View className="bg-primary-700 p-6 rounded-3xl shadow-lg shadow-primary-200 mb-6">
          <Text className="text-white font-medium text-lg">Hoş Geldin,</Text>
          <Text className="text-white font-extrabold text-3xl mt-1">{role.replace("_", " ").toUpperCase()}</Text>
          <Text className="text-primary-100 mt-2">Sistemde tam yetkiniz bulunuyor.</Text>
        </View>
        <Text className="text-lg font-bold text-slate-900 mb-4">Hızlı İşlemler</Text>
        <View className="flex-row flex-wrap gap-4">
          <Pressable className="bg-white p-5 rounded-3xl w-[47%] shadow-sm"><Users color="#0F766E" size={32} /><Text className="font-bold text-slate-900 mt-4">Kullanıcılar</Text><Text className="text-slate-500 text-xs mt-1">Rolleri ve banları yönet</Text></Pressable>
          <Pressable className="bg-white p-5 rounded-3xl w-[47%] shadow-sm"><FileWarning color="#F59E0B" size={32} /><Text className="font-bold text-slate-900 mt-4">Şikayetler</Text><Text className="text-slate-500 text-xs mt-1">İhlalleri incele</Text></Pressable>
          {isTechnicalAdmin && <Pressable className="bg-white p-5 rounded-3xl w-[47%] shadow-sm"><Database color="#3B82F6" size={32} /><Text className="font-bold text-slate-900 mt-4">Sistem</Text><Text className="text-slate-500 text-xs mt-1">Loglar ve veritabanı</Text></Pressable>}
          {isCurator && <Pressable className="bg-white p-5 rounded-3xl w-[47%] shadow-sm"><ShieldAlert color="#DC2626" size={32} /><Text className="font-bold text-slate-900 mt-4">Küratör</Text><Text className="text-slate-500 text-xs mt-1">Tam sistem kontrolü</Text></Pressable>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
