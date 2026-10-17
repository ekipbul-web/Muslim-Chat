import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Link, router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else router.replace("/(tabs)/chats");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text className="text-5xl text-center mb-2">🕌</Text>
          <Text className="text-3xl font-bold text-center text-slate-900">
            MuslimChat
          </Text>
          <Text className="text-center text-slate-500 mt-2 mb-8">
            Hoş geldiniz
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Input
            label="E-posta"
            placeholder="ornek@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Şifre"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          ) : null}
          <Button
            label="Giriş Yap"
            onPress={handleLogin}
            loading={loading}
            fullWidth
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Link href="/(auth)/register" asChild>
            <Text className="text-center text-primary-700 mt-6">
              Hesabın yok mu? <Text className="font-bold">Kayıt ol</Text>
            </Text>
          </Link>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
