import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Image, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Plus, Camera, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function Status() {
  const profile = useAuthStore((s) => s.profile);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [caption, setCaption] = useState("");

  useEffect(() => { loadStatuses(); }, []);

  const loadStatuses = async () => {
    const { data } = await supabase.from("status_updates").select("*, profiles(full_name)").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false });
    setStatuses(data ?? []);
  };

  const addStatus = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5, base64: true });
    if (!result.canceled && result.assets[0].base64) {
      await supabase.from("status_updates").insert({ user_id: profile?.id, media_url: `data:image/jpeg;base64,${result.assets[0].base64}`, content: caption });
      setModalVisible(false); setCaption(""); loadStatuses();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={["top"]}>
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center"><Text className="text-3xl font-extrabold text-slate-900 dark:text-white">Durum</Text><Pressable onPress={() => setModalVisible(true)} className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center"><Plus color="#0F766E" size={26} /></Pressable></View>
      <FlatList data={statuses} keyExtractor={(s) => s.id} contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">Henüz durum paylaşılmamış.</Text>}
        renderItem={({ item }) => (
          <View className="mb-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-3xl">
            <View className="flex-row items-center mb-2 px-2 pt-2"><Text className="font-bold text-slate-900 dark:text-white">{item.profiles?.full_name}</Text></View>
            <Image source={{ uri: item.media_url }} style={{ width: "100%", height: 250, borderRadius: 20 }} />
            {item.content ? <Text className="text-slate-700 dark:text-slate-300 mt-2 px-2 pb-2">{item.content}</Text> : null}
          </View>
        )} />
    </SafeAreaView>
  );
}
