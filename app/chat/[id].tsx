import { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/Avatar";
import { ArrowLeft, Send, Image as ImageIcon, Mic, MoreVertical, Flag } from "lucide-react-native";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const profile = useAuthStore((s) => s.profile);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [chatName, setChatName] = useState("Sohbet");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!id) return;
    loadChat(); loadMessages();
    const channel = supabase.channel(`chat-${id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${id}` }, (payload) => { setMessages((prev) => [...prev, payload.new]); }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const loadChat = async () => {
    const { data } = await supabase.from("chats").select("name").eq("id", id).single();
    if (data?.name) setChatName(data.name);
  };

  const loadMessages = async () => {
    const { data } = await supabase.from("messages").select("*, sender:profiles(full_name)").eq("chat_id", id).eq("deleted", false).order("created_at", { ascending: true });
    setMessages(data ?? []);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5, base64: true });
    if (!result.canceled && result.assets[0].base64) await supabase.from("messages").insert({ chat_id: id, sender_id: profile?.id, content: "📷 Fotoğraf", media_url: `data:image/jpeg;base64,${result.assets[0].base64}`, media_type: "image", type: "media" });
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) { Alert.alert("Hata", "Mikrofon izni gerekli."); }
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    await supabase.from("messages").insert({ chat_id: id, sender_id: profile?.id, content: "🎤 Ses Kaydı", type: "audio" });
    setRecording(null);
  };

  const sendMessage = async () => {
    if (!text.trim() || !profile) return;
    const content = text.trim(); setText("");
    await supabase.from("messages").insert({ chat_id: id, sender_id: profile.id, content, type: "text" });
  };

  const reportMessage = async (msgId: string) => {
    await supabase.from("reports").insert({ reporter_id: profile?.id, target_message_id: msgId, reason: "Uygunsuz içerik" });
    Alert.alert("Başarılı", "Mesaj yöneticilere şikayet edildi.");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <Pressable onPress={() => router.back()} className="p-2 mr-2"><ArrowLeft color="#0F172A" size={24} /></Pressable>
          <Avatar name={chatName} size={40} /><View className="ml-3"><Text className="font-bold text-slate-900 dark:text-white text-lg">{chatName}</Text><Text className="text-xs text-green-500">çevrimiçi</Text></View>
        </View>
        <FlatList ref={flatListRef} data={messages} keyExtractor={(m) => m.id} contentContainerStyle={{ padding: 16 }} onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMine = item.sender_id === profile?.id;
            return (
              <View className={`mb-3 ${isMine ? "items-end" : "items-start"}`}>
                <View className={`max-w-[80%] px-4 py-3 rounded-3xl ${isMine ? "bg-primary-600 rounded-br-sm" : "bg-white dark:bg-slate-800 rounded-bl-sm shadow-sm"}`}>
                  {item.media_url && <Image source={{ uri: item.media_url }} style={{ width: 200, height: 200, borderRadius: 12, marginBottom: 8 }} />}
                  <Text className={`text-base ${isMine ? "text-white" : "text-slate-900 dark:text-white"}`}>{item.content}</Text>
                  <View className="flex-row justify-end items-center mt-1">
                    <Text className={`text-[10px] mr-2 ${isMine ? "text-primary-200" : "text-slate-400"}`}>{format(new Date(item.created_at), "HH:mm")} {isMine ? "✓✓" : ""}</Text>
                    {!isMine && <Pressable onPress={() => reportMessage(item.id)} className="p-1"><Flag color="#F87171" size={12} /></Pressable>}
                  </View>
                </View>
              </View>
            );
          }} />
        <View className="flex-row items-end px-3 py-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          <Pressable onPress={pickImage} className="p-2 mb-1"><ImageIcon color="#0F766E" size={24} /></Pressable>
          <TextInput value={text} onChangeText={setText} placeholder="Mesaj yazın..." placeholderTextColor="#94A3B8" multiline className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-3xl px-4 py-3 max-h-32 text-slate-900 dark:text-white" />
          <Pressable onPressIn={startRecording} onPressOut={stopRecording} className={`p-2 mb-1 ml-1 ${recording ? "bg-red-100 rounded-full" : ""}`}><Mic color={recording ? "#DC2626" : "#0F766E"} size={24} /></Pressable>
          <Pressable onPress={sendMessage} className="ml-2 w-12 h-12 rounded-full bg-primary-600 items-center justify-center"><Send color="#fff" size={20} /></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
