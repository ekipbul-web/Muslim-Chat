import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/Avatar";
import { RoleBadge } from "@/components/RoleBadge";
import { Search } from "lucide-react-native";

export default function Contacts() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    loadUsers();
  }, [query]);

  const loadUsers = async () => {
    let q = supabase.from("profiles").select("*").limit(50);
    if (query) q = q.ilike("username", `%${query}%`);
    const { data } = await q;
    setUsers(data ?? []);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-4 py-4">
        <Text className="text-3xl font-bold text-slate-900 mb-4">Kişiler</Text>
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 py-3">
          <Search size={20} color="#94A3B8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Kullanıcı ara..."
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-2 text-slate-900"
          />
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 30)}>
            <Pressable className="flex-row items-center py-3">
              <Avatar
                uri={item.avatar_url}
                name={item.full_name}
                size={52}
                role={item.role}
              />
              <View className="flex-1 ml-3">
                <Text className="font-bold text-slate-900">
                  {item.full_name}
                </Text>
                <Text className="text-slate-500 text-sm">@{item.username}</Text>
              </View>
              <RoleBadge role={item.role} />
            </Pressable>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
