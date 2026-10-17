import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/Avatar";
import { Plus, MessageSquare } from "lucide-react-native";

export default function Chats() {
  const profile = useAuthStore((s) => s.profile);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    loadChats();
    const channel = supabase.channel("chats-changes").on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => loadChats()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  const loadChats = async () => {
    const { data } = await supabase.from("chat_members").select("chat_id, chats(id, is_group)").eq("user_id", profile?.id);
    if (!data) return setLoading(false);
    const enriched = await Promise.all(data.map(async (row: any) => {
      const other = await supabase.from("chat_members").select("profiles(full_name, avatar_url)").eq("chat_id", row.chat_id).neq("user_id", profile?.id).single();
      const lastMsg = await supabase.from("messages").select("content, created_at").eq("chat_id", row.chat_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      return { id: row.chat_id, name: other.data?.profiles?.full_name || "Sohbet", avatar: other.data?.profiles?.avatar_url, last_message: lastMsg.data?.content || "Henüz mesaj yok" };
    }));
    setChats(enriched); setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center bg-white border-b border-slate-100">
        <View className="flex-row items-center"><Image source={require("../../logo.png")} style={{ width: 32, height: 32 }} resizeMode="contain" className="mr-3" /><Text className="text-3xl font-extrabold text-slate-900 tracking-tight">Sohbetler</Text></View>
        <Pressable onPress={() => router.push("/(tabs)/contacts")} className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center"><Plus color="#0F766E" size={26} /></Pressable>
      </View>
      {loading ? <ActivityIndicator size="large" color="#0F766E" className="mt-10" /> : (
        <FlatList data={chats} keyExtractor={(item) => item.id} contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<View className="items-center py-32"><View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-6 shadow-sm"><MessageSquare color="#94A3B8" size={40} /></View><Text className="text-slate-900 text-xl font-bold mb-2">Henüz sohbet yok</Text><Text className="text-slate-500 text-center px-8">Yeni bir sohbet başlatmak için sağ üstteki + butonuna tıklayın.</Text></View>}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 50)}>
              <Pressable onPress={() => router.push(`/chat/${item.id}`)} className="flex-row items-center p-4 mb-3 bg-white rounded-3xl active:bg-slate-50 shadow-sm shadow-slate-200/50">
                <Avatar uri={item.avatar} name={item.name} size={60} />
                <View className="flex-1 ml-4 justify-center"><View className="flex-row justify-between items-center mb-1"><Text className="font-bold text-slate-900 text-lg">{item.name}</Text></View><Text numberOfLines={1} className="text-slate-500 text-sm">{item.last_message}</Text></View>
              </Pressable>
            </Animated.View>
          )} />
      )}
    </SafeAreaView>
  );
}
