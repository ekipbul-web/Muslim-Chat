import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/Avatar";
import { RoleBadge } from "@/components/RoleBadge";
import { Search, MessageCircle } from "lucide-react-native";

export default function Contacts() {
  const profile = useAuthStore((s) => s.profile);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [query]);

  const loadUsers = async () => {
    let q = supabase.from("profiles").select("*").neq("id", profile?.id).limit(50);
    if (query) q = q.ilike("username", `%${query}%`);
    const { data } = await q;
    setUsers(data ?? []);
  };

  const startChat = async (otherUser: any) => {
    setLoading(true);
    const { data: existing } = await supabase.from("chat_members").select("chat_id, chats!inner(id, is_group)").eq("user_id", profile?.id).eq("chats.is_group", false);
    let chatId = null;

    // Çok basit bir kontrol: Eğer zaten bu kullanıcıyla bir sohbet varsa aç (Gelişmiş kontrol)
    if (existing && existing.length > 0) {
        const { data: members } = await supabase.from("chat_members").select("chat_id, user_id").in("chat_id", existing.map(e => e.chat_id));
        const mutual = members?.filter(m => m.user_id === otherUser.id);
        if (mutual && mutual.length > 0) chatId = mutual[0].chat_id;
    }

    if (!chatId) {
      const { data: newChat } = await supabase.from("chats").insert({ is_group: false }).select().single();
      if (newChat) {
        await supabase.from("chat_members").insert([
          { chat_id: newChat.id, user_id: profile?.id },
          { chat_id: newChat.id, user_id: otherUser.id }
        ]);
        chatId = newChat.id;
      }
    }
    setLoading(false);
    if (chatId) router.push(`/chat/${chatId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-6 pt-6 pb-4">
        <Text className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Kişiler</Text>
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3">
          <Search size={20} color="#94A3B8" />
          <TextInput value={query} onChangeText={setQuery} placeholder="Kullanıcı ara..." placeholderTextColor="#94A3B8" className="flex-1 ml-3 text-slate-900 text-base" />
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 30)}>
            <Pressable onPress={() => startChat(item)} className="flex-row items-center py-4 border-b border-slate-50 active:bg-slate-50 rounded-xl px-2">
              <Avatar uri={item.avatar_url} name={item.full_name} size={56} role={item.role} />
              <View className="flex-1 ml-4">
                <Text className="font-bold text-slate-900 text-base">{item.full_name || "İsimsiz"}</Text>
                <Text className="text-slate-500 text-sm">@{item.username || "kullanici"}</Text>
              </View>
              <View className="bg-primary-50 p-2.5 rounded-full">
                <MessageCircle color="#0F766E" size={20} />
              </View>
            </Pressable>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
