import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/Avatar";
import { Search, MessageCircle, Ban, Users } from "lucide-react-native";

export default function Contacts() {
  const profile = useAuthStore((s) => s.profile);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => { loadUsers(); }, [query]);

  const loadUsers = async () => {
    const { data: blocked } = await supabase.from("blocked_users").select("blocked_id").eq("blocker_id", profile?.id);
    const blockedIds = blocked?.map(b => b.blocked_id) || [];
    let q = supabase.from("profiles").select("*").neq("id", profile?.id).limit(50);
    if (query) q = q.ilike("username", `%${query}%`);
    const { data } = await q; 
    if (data) setUsers(data.filter(u => !blockedIds.includes(u.id)));
  };

  const startChat = async (otherUser: any) => {
    const { data: newChat } = await supabase.from("chats").insert({ is_group: false }).select().single();
    if (newChat) {
      await supabase.from("chat_members").insert([{ chat_id: newChat.id, user_id: profile?.id }, { chat_id: newChat.id, user_id: otherUser.id }]);
      router.push(`/chat/${newChat.id}`);
    }
  };

  const blockUser = async (id: string) => {
    await supabase.from("blocked_users").insert({ blocker_id: profile?.id, blocked_id: id });
    Alert.alert("Engellendi", "Bu kullanıcıyı engellediniz."); loadUsers();
  };

  const createGroup = async () => {
    const { data: newChat } = await supabase.from("chats").insert({ is_group: true, name: "Yeni Grup" }).select().single();
    if (newChat) {
      await supabase.from("chat_members").insert({ chat_id: newChat.id, user_id: profile?.id });
      router.push(`/chat/${newChat.id}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <View className="px-6 pt-6 pb-4 bg-white border-b border-slate-100">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">Kişiler</Text>
          <Pressable onPress={createGroup} className="bg-primary-50 px-4 py-2 rounded-xl flex-row items-center"><Users color="#0F766E" size={18} /><Text className="text-primary-700 font-bold ml-2">Grup Kur</Text></Pressable>
        </View>
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3"><Search size={20} color="#94A3B8" /><TextInput value={query} onChangeText={setQuery} placeholder="Kullanıcı ara..." className="flex-1 ml-3 text-slate-900" /></View>
      </View>
      <FlatList data={users} keyExtractor={(u) => u.id} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 30)}>
            <View className="flex-row items-center p-4 mb-3 bg-white rounded-3xl shadow-sm shadow-slate-200/50">
              <Avatar uri={item.avatar_url} name={item.full_name} size={56} />
              <View className="flex-1 ml-4"><Text className="font-bold text-slate-900 text-lg">{item.full_name}</Text><Text className="text-slate-500 text-sm">@{item.username}</Text></View>
              <Pressable onPress={() => blockUser(item.id)} className="bg-red-50 p-3 rounded-full mr-3"><Ban color="#DC2626" size={20} /></Pressable>
              <Pressable onPress={() => startChat(item)} className="bg-primary-50 p-3 rounded-full"><MessageCircle color="#0F766E" size={20} /></Pressable>
            </View>
          </Animated.View>
        )} />
    </SafeAreaView>
  );
}
