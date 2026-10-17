import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/Avatar";
import { Camera, ArrowLeft, Check } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function EditProfile() {
  const profile = useAuthStore((s) => s.profile);
  const refresh = useAuthStore((s) => s.refresh);
  const [username, setUsername] = useState(profile?.username || "");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5, base64: true });
    if (!result.canceled && result.assets[0].base64) setAvatarUrl(`data:image/jpeg;base64,${result.assets[0].base64}`);
  };

  const handleSave = async () => {
    setLoading(true);
    await supabase.from("profiles").update({ username, full_name: fullName, bio, avatar_url: avatarUrl }).eq("id", profile?.id);
    await refresh(); setLoading(false); router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
        <Pressable onPress={() => router.back()} className="p-2"><ArrowLeft color="#0F172A" size={24} /></Pressable>
        <Text className="text-lg font-bold text-slate-900">Profili Düzenle</Text>
        <Pressable onPress={handleSave} disabled={loading} className="p-2">{loading ? <ActivityIndicator color="#0F766E" /> : <Check color="#0F766E" size={24} />}</Pressable>
      </View>
      <ScrollView className="flex-1 px-6 pt-8">
        <View className="items-center mb-8">
          <Pressable onPress={pickImage} className="relative"><Avatar uri={avatarUrl} name={fullName} size={110} /><View className="absolute bottom-0 right-0 bg-primary-600 p-2.5 rounded-full border-4 border-white"><Camera color="#fff" size={20} /></View></Pressable>
          <Text className="text-slate-400 text-xs mt-3">Fotoğrafı değiştirmek için tıkla</Text>
        </View>
        <View className="mb-5"><Text className="text-slate-700 font-bold mb-2 ml-1">Ad Soyad</Text><TextInput value={fullName} onChangeText={setFullName} className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-base" placeholder="Adınız Soyadınız" /></View>
        <View className="mb-5"><Text className="text-slate-700 font-bold mb-2 ml-1">Kullanıcı Adı</Text><TextInput value={username} onChangeText={setUsername} autoCapitalize="none" className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-base" placeholder="kullanici_adi" /></View>
        <View className="mb-8"><Text className="text-slate-700 font-bold mb-2 ml-1">Hakkımda</Text><TextInput value={bio} onChangeText={setBio} multiline numberOfLines={4} className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 text-base h-28" placeholder="Kendinizden bahsedin..." textAlignVertical="top" /></View>
      </ScrollView>
    </SafeAreaView>
  );
}
