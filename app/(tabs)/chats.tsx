import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/Avatar";
import { Plus } from "lucide-react-native";

type Chat = {
  id: string;
  name: string;
  last_message: string;
  avatar_url: string | null;
};

export default function Chats() {
  const profile = useAuthStore((s) => s.profile);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    loadChats();

    const channel = supabase
      .channel("chats-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => loadChats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const loadChats = async () => {
    const { data } = await supabase
      .from("chat_members")
      .select("chat_id, chats(id, name, is_group, created_at)")
      .eq("user_id", profile?.id);

    if (!data) return setLoading(false);

    const enriched = await Promise.all(
      data.map(async (row: any) => {
        const chat = row.chats;
        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("chat_id", chat.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          id: chat.id,
          name: chat.name ?? "Sohbet",
          last_message: lastMsg?.content ?? "Henüz mesaj yok",
          avatar_url: null,
        };
      })
    );

    setChats(enriched);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-4 py-4 flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-slate-900">Sohbetler</Text>
        <Pressable
          onPress={() => router.push("/(tabs)/contacts" as any)}
          className="w-12 h-12 rounded-full bg-primary-700 items-center justify-center"
        >
          <Plus color="#fff" size={24} />
        </Pressable>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Text className="text-6xl mb-4">💬</Text>
            <Text className="text-slate-500 text-lg">Henüz sohbet yok</Text>
            <Text className="text-slate-400 text-sm mt-1">
              Kişiler sekmesinden başla
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50)}>
            <Pressable
              onPress={() => router.push(`/chat/${item.id}` as any)}
              className="flex-row items-center py-3"
            >
              <Avatar name={item.name} size={56} />
              <View className="flex-1 ml-3">
                <Text className="font-bold text-slate-900 text-base">
                  {item.name}
                </Text>
                <Text numberOfLines={1} className="text-slate-500 text-sm mt-0.5">
                  {item.last_message}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}
