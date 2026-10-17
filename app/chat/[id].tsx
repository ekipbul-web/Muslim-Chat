import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/Avatar";
import { ArrowLeft, Send } from "lucide-react-native";
import { format } from "date-fns";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: { full_name: string; avatar_url: string | null };
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useAuthStore((s) => s.profile);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [chatName, setChatName] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!id) return;
    loadChat();
    loadMessages();

    const channel = supabase
      .channel(`chat-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const loadChat = async () => {
    const { data } = await supabase
      .from("chats")
      .select("name")
      .eq("id", id)
      .single();
    setChatName(data?.name ?? "Sohbet");
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, sender:profiles(full_name, avatar_url)")
      .eq("chat_id", id)
      .order("created_at", { ascending: true });
    setMessages((data as any) ?? []);
  };

  const sendMessage = async () => {
    if (!text.trim() || !profile) return;
    const content = text.trim();
    setText("");
    await supabase.from("messages").insert({
      chat_id: id,
      sender_id: profile.id,
      content,
      type: "text",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
          <Pressable onPress={() => router.back()} className="p-2">
            <ArrowLeft color="#0F172A" size={24} />
          </Pressable>
          <Avatar name={chatName} size={40} />
          <View className="ml-3">
            <Text className="font-bold text-slate-900">{chatName}</Text>
            <Text className="text-xs text-slate-500">çevrimiçi</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={({ item, index }) => {
            const isMine = item.sender_id === profile?.id;
            return (
              <Animated.View
                entering={FadeInDown.delay(Math.min(index, 10) * 20)}
                className={`mb-2 ${isMine ? "items-end" : "items-start"}`}
              >
                <View
                  className={`max-w-[80%] px-4 py-2.5 rounded-3xl ${
                    isMine
                      ? "bg-primary-700 rounded-br-md"
                      : "bg-slate-100 rounded-bl-md"
                  }`}
                >
                  {!isMine ? (
                    <Text className="text-xs font-bold text-primary-700 mb-1">
                      {item.sender?.full_name ?? "Kullanıcı"}
                    </Text>
                  ) : null}
                  <Text
                    className={`text-base ${
                      isMine ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {item.content}
                  </Text>
                  <Text
                    className={`text-[10px] mt-1 ${
                      isMine ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    {format(new Date(item.created_at), "HH:mm")}
                  </Text>
                </View>
              </Animated.View>
            );
          }}
        />

        <View className="flex-row items-end px-3 py-2 border-t border-slate-100">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Mesaj yaz..."
            placeholderTextColor="#94A3B8"
            multiline
            className="flex-1 bg-slate-100 rounded-3xl px-4 py-3 max-h-24 text-slate-900"
          />
          <Pressable
            onPress={sendMessage}
            className="ml-2 w-12 h-12 rounded-full bg-primary-700 items-center justify-center"
          >
            <Send color="#fff" size={20} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
