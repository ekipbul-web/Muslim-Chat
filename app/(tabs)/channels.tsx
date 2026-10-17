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
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center bg-white border-b border-slate-100"><Text className="text-3xl font-extrabold text-slate-900 tracking-tight">Kanallar</Text>
        {isAssistant && <Pressable onPress={() => setModal(true)} className="w-12 h-12 bg-primary-50 rounded-full items-center justify-center"><Plus color="#0F766E" size={24} /></Pressable>}
      </View>
      <FlatList data={channels} keyExtractor={(c) => c.id} contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">Henüz kanal yok.</Text>}
        renderItem={({ item }) => (
          <View className="bg-white p-5 rounded-3xl mb-3 flex-row items-center shadow-sm shadow-slate-200/50">
            <View className="w-14 h-14 bg-primary-600 rounded-2xl items-center justify-center mr-4 shadow-md shadow-primary-200"><Megaphone color="#fff" size={28} /></View>
            <View className="flex-1"><Text className="font-bold text-lg text-slate-900">{item.name}</Text><Text className="text-slate-500 text-sm mt-1">{item.description}</Text></View>
          </View>
        )} />
      <Modal visible={modal} animationType="fade" transparent> 
        <View className="flex-1 justify-center bg-black/40 px-6"><View className="bg-white p-6 rounded-[32px] shadow-2xl">
          <Text className="text-2xl font-extrabold mb-4 text-slate-900">Yeni Kanal Aç</Text>
          <TextInput placeholder="Kanal Adı" value={name} onChangeText={setName} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-3" />
          <TextInput placeholder="Açıklama" value={desc} onChangeText={setDesc} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-6" />
          <Pressable onPress={createChannel} className="bg-primary-600 p-4 rounded-2xl items-center shadow-lg shadow-primary-200">{loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Oluştur</Text>}</Pressable>
          <Pressable onPress={() => setModal(false)} className="mt-4 items-center"><Text className="text-slate-500 font-bold">İptal</Text></Pressable>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}
