import { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/Avatar";
import { ArrowLeft, Send } from "lucide-react-native";
import { format } from "date-fns";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const profile = useAuthStore((s) => s.profile);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [chatName, setChatName] = useState("Sohbet");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!id) return;
    loadChat();
    loadMessages();
    const channel = supabase.channel(`chat-${id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${id}` }, (payload) => {
      setMessages((prev) => [...prev, payload.new]);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const loadChat = async () => {
    const { data } = await supabase.from("chat_members").select("profiles(full_name)").eq("chat_id", id).neq("user_id", profile?.id).single();
    if (data?.profiles?.full_name) setChatName(data.profiles.full_name);
  };

  const loadMessages = async () => {
    const { data } = await supabase.from("messages").select("*, sender:profiles(full_name, avatar_url)").eq("chat_id", id).order("created_at", { ascending: true });
    setMessages(data ?? []);
  };

  const sendMessage = async () => {
    if (!text.trim() || !profile) return;
    const content = text.trim(); setText("");
    await supabase.from("messages").insert({ chat_id: id, sender_id: profile.id, content, type: "text" });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
          <Pressable onPress={() => router.back()} className="p-2 mr-2"><ArrowLeft color="#0F172A" size={24} /></Pressable>
          <Avatar name={chatName} size={40} />
          <View className="ml-3"><Text className="font-bold text-slate-900 text-lg">{chatName}</Text><Text className="text-xs text-green-500 font-medium">çevrimiçi</Text></View>
        </View>

        <FlatList ref={flatListRef} data={messages} keyExtractor={(m) => m.id} contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMine = item.sender_id === profile?.id;
            return (
              <View className={`mb-3 ${isMine ? "items-end" : "items-start"}`}>
                <View className={`max-w-[80%] px-4 py-3 rounded-3xl ${isMine ? "bg-primary-600 rounded-br-sm" : "bg-white rounded-bl-sm shadow-sm shadow-slate-200"}`}>
                  <Text className={`text-base ${isMine ? "text-white" : "text-slate-900"}`}>{item.content}</Text>
                  <Text className={`text-[10px] mt-1 text-right ${isMine ? "text-primary-200" : "text-slate-400"}`}>{format(new Date(item.created_at), "HH:mm")}</Text>
                </View>
              </View>
            );
          }}
        />

        <View className="flex-row items-end px-3 py-3 bg-white border-t border-slate-100">
          <TextInput value={text} onChangeText={setText} placeholder="Mesaj yazın..." placeholderTextColor="#94A3B8" multiline className="flex-1 bg-slate-100 rounded-3xl px-4 py-3 max-h-32 text-slate-900" />
          <Pressable onPress={sendMessage} className="ml-2 w-12 h-12 rounded-full bg-primary-600 items-center justify-center shadow-md shadow-primary-200"><Send color="#fff" size={20} /></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
