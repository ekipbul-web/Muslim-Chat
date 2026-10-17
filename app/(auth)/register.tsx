import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, Pressable, ActivityIndicator, Image } from "react-native";
import { Link, router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { User, Mail, Lock, UserPlus } from "lucide-react-native";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true); setError("");
    const { error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { username, full_name: fullName } } });
    setLoading(false);
    if (signUpError) setError(signUpError.message);
    else router.replace("/(tabs)/chats");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} className="px-6 py-12">
        <Animated.View entering={FadeInDown.duration(800)} className="items-center mb-8">
          <View className="w-24 h-24 bg-white rounded-[30px] items-center justify-center mb-4 shadow-xl shadow-primary-200 border border-slate-100"><Image source={require("../../logo.png")} style={{ width: 80, height: 80 }} resizeMode="contain" /></View>
          <Text className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Aramıza Katıl</Text>
          <Text className="text-base text-slate-500 font-medium">MuslimChat ailesine katıl</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).duration(800)} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          {error ? <Text className="text-red-500 text-center mb-4 bg-red-50 p-3 rounded-xl">{error}</Text> : null}
          <View className="mb-4"><Text className="text-slate-700 font-bold mb-2 ml-1">Kullanıcı Adı</Text><View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3"><User color="#94A3B8" size={20} /><TextInput value={username} onChangeText={setUsername} placeholder="kullanici_adi" className="flex-1 ml-3 text-slate-900" autoCapitalize="none" /></View></View>
          <View className="mb-4"><Text className="text-slate-700 font-bold mb-2 ml-1">Ad Soyad</Text><View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3"><User color="#94A3B8" size={20} /><TextInput value={fullName} onChangeText={setFullName} placeholder="Adınız Soyadınız" className="flex-1 ml-3 text-slate-900" /></View></View>
          <View className="mb-4"><Text className="text-slate-700 font-bold mb-2 ml-1">E-posta</Text><View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3"><Mail color="#94A3B8" size={20} /><TextInput value={email} onChangeText={setEmail} placeholder="ornek@email.com" className="flex-1 ml-3 text-slate-900" keyboardType="email-address" autoCapitalize="none" /></View></View>
          <View className="mb-6"><Text className="text-slate-700 font-bold mb-2 ml-1">Şifre</Text><View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3"><Lock color="#94A3B8" size={20} /><TextInput value={password} onChangeText={setPassword} placeholder="••••••••" className="flex-1 ml-3 text-slate-900" secureTextEntry /></View></View>
          <Pressable onPress={handleRegister} disabled={loading} className="bg-primary-600 rounded-2xl py-4 flex-row justify-center items-center shadow-lg shadow-primary-200">
            {loading ? <ActivityIndicator color="#fff" /> : <><UserPlus color="#fff" size={20} /><Text className="text-white font-bold text-lg ml-2">Kayıt Ol</Text></>}
          </Pressable>
        </Animated.View>
        <Link href="/(auth)/login" asChild><Pressable className="mt-8 items-center"><Text className="text-slate-500 text-base">Zaten hesabın var mı? <Text className="text-primary-600 font-bold">Giriş Yap</Text></Text></Pressable></Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
