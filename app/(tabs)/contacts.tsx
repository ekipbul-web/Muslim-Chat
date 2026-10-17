import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/Avatar";
import { Search, MessageCircle, Ban } from "lucide-react-native";

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

  const blockUser = async (id: string) => {
    await supabase.from("blocked_users").insert({ blocker_id: profile?.id, blocked_id: id });
    Alert.alert("Engellendi", "Bu kullanıcıyı engellediniz."); loadUsers();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={["top"]}>
      <View className="px-6 pt-6 pb-4"><Text className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Kişiler</Text><View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3"><Search size={20} color="#94A3B8" /><TextInput value={query} onChangeText={setQuery} placeholder="Kullanıcı ara..." className="flex-1 ml-3 dark:text-white" /></View></View>
      <FlatList data={users} keyExtractor={(u) => u.id} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center py-4 border-b border-slate-50 dark:border-slate-800">
            <Avatar uri={item.avatar_url} name={item.full_name} size={56} />
            <View className="flex-1 ml-4"><Text className="font-bold text-slate-900 dark:text-white">{item.full_name}</Text><Text className="text-slate-500 text-sm">@{item.username}</Text></View>
            <Pressable onPress={() => blockUser(item.id)} className="bg-red-50 p-3 rounded-full mr-2"><Ban color="#DC2626" size={20} /></Pressable>
          </View>
        )} />
    </SafeAreaView>
  );
}
