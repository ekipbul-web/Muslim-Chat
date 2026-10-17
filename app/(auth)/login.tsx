import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, TextInput, Pressable, ActivityIndicator, Image } from "react-native";
import { Link, router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, LogIn } from "lucide-react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.replace("/(tabs)/chats");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-slate-50">
      <View className="flex-1 justify-center px-6">
        <Animated.View entering={FadeInDown.duration(800)} className="items-center mb-10">
          <View className="w-28 h-28 bg-white rounded-[35px] items-center justify-center mb-4 shadow-xl shadow-primary-200 overflow-hidden border border-slate-100">
            <Image source={require("../../logo.png")} style={{ width: 100, height: 100 }} resizeMode="contain" />
          </View>
          <Text className="text-4xl font-extrabold text-slate-900 tracking-tight">MuslimChat</Text>
          <Text className="text-base text-slate-500 mt-2 font-medium">Tekrar hoş geldiniz</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(800)} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          {error ? <Text className="text-red-500 text-center mb-4 bg-red-50 p-3 rounded-xl">{error}</Text> : null}
          <View className="mb-4"><Text className="text-slate-700 font-bold mb-2 ml-1">E-posta</Text><View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3"><Mail color="#94A3B8" size={20} /><TextInput value={email} onChangeText={setEmail} placeholder="ornek@email.com" className="flex-1 ml-3 text-slate-900" keyboardType="email-address" autoCapitalize="none" /></View></View>
          <View className="mb-6"><Text className="text-slate-700 font-bold mb-2 ml-1">Şifre</Text><View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3"><Lock color="#94A3B8" size={20} /><TextInput value={password} onChangeText={setPassword} placeholder="••••••••" className="flex-1 ml-3 text-slate-900" secureTextEntry /></View></View>
          <Pressable onPress={handleLogin} disabled={loading} className="bg-primary-600 rounded-2xl py-4 flex-row justify-center items-center shadow-lg shadow-primary-200">
            {loading ? <ActivityIndicator color="#fff" /> : <><LogIn color="#fff" size={20} /><Text className="text-white font-bold text-lg ml-2">Giriş Yap</Text></>}
          </Pressable>
        </Animated.View>
        <Link href="/(auth)/register" asChild><Pressable className="mt-8 items-center"><Text className="text-slate-500 text-base">Hesabın yok mu? <Text className="text-primary-600 font-bold">Hemen Kayıt Ol</Text></Text></Pressable></Link>
      </View>
    </KeyboardAvoidingView>
  );
}
