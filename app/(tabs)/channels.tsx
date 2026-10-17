import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { usePermissions } from "@/hooks/usePermissions";
import { Plus, Megaphone } from "lucide-react-native";

export default function Channels() {
  const profile = useAuthStore((s) => s.profile);
  const { isAssistant } = usePermissions();
  const [channels, setChannels] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadChannels(); }, []);

  const loadChannels = async () => {
    const { data } = await supabase.from("channels").select("*").order("created_at", { ascending: false });
    setChannels(data || []);
  };

  const createChannel = async () => {
    setLoading(true);
    await supabase.from("channels").insert({ name, description: desc, owner_id: profile?.id });
    setLoading(false); setModal(false); setName(""); setDesc(""); loadChannels();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={["top"]}>
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center"><Text className="text-3xl font-extrabold text-slate-900 dark:text-white">Kanallar</Text>
        {isAssistant && <Pressable onPress={() => setModal(true)} className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center"><Plus color="#0F766E" size={24} /></Pressable>}
      </View>
      <FlatList data={channels} keyExtractor={(c) => c.id} contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">Henüz kanal yok.</Text>}
        renderItem={({ item }) => (
          <View className="bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl mb-3 flex-row items-center shadow-sm">
            <View className="w-12 h-12 bg-primary-600 rounded-2xl items-center justify-center mr-4"><Megaphone color="#fff" size={24} /></View>
            <View className="flex-1"><Text className="font-bold text-lg text-slate-900 dark:text-white">{item.name}</Text><Text className="text-slate-500 text-sm">{item.description}</Text></View>
          </View>
        )} />
      <Modal visible={modal} animationType="slide" transparent> 
        <View className="flex-1 justify-center bg-black/50 px-6"><View className="bg-white dark:bg-slate-800 p-6 rounded-3xl">
          <Text className="text-xl font-bold mb-4 dark:text-white">Yeni Kanal Aç</Text>
          <TextInput placeholder="Kanal Adı" value={name} onChangeText={setName} className="bg-slate-100 p-3 rounded-xl mb-3" />
          <TextInput placeholder="Açıklama" value={desc} onChangeText={setDesc} className="bg-slate-100 p-3 rounded-xl mb-4" />
          <Pressable onPress={createChannel} className="bg-primary-600 p-4 rounded-xl items-center">{loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Oluştur</Text>}</Pressable>
          <Pressable onPress={() => setModal(false)} className="mt-4 items-center"><Text className="text-slate-500">İptal</Text></Pressable>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}
