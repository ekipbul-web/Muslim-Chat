import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function Status() {
  const profile = useAuthStore((s) => s.profile);
  const [statuses, setStatuses] = useState<any[]>([]);

  useEffect(() => { loadStatuses(); }, []);

  const loadStatuses = async () => {
    const { data } = await supabase.from("status_updates").select("*, profiles(full_name)").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false });
    setStatuses(data ?? []);
  };

  const addStatus = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5, base64: true });
    if (!result.canceled && result.assets[0].base64) {
      await supabase.from("status_updates").insert({ user_id: profile?.id, media_url: `data:image/jpeg;base64,${result.assets[0].base64}` });
      loadStatuses();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center bg-white border-b border-slate-100"><Text className="text-3xl font-extrabold text-slate-900 tracking-tight">Durum</Text><Pressable onPress={addStatus} className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center"><Plus color="#0F766E" size={26} /></Pressable></View>
      <FlatList data={statuses} keyExtractor={(s) => s.id} contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">Henüz durum paylaşılmamış.</Text>}
        renderItem={({ item }) => (
          <View className="mb-6 bg-white p-4 rounded-3xl shadow-sm shadow-slate-200/50">
            <View className="flex-row items-center mb-3"><Text className="font-bold text-slate-900">{item.profiles?.full_name}</Text></View>
            <Image source={{ uri: item.media_url }} style={{ width: "100%", height: 250, borderRadius: 20 }} />
          </View>
        )} />
    </SafeAreaView>
  );
}
