import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Kayıt başarısız");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      username,
      full_name: fullName,
    });

    setLoading(false);
    if (profileError) setError(profileError.message);
    else router.replace("/(tabs)/chats");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="px-6 py-12">
          <Animated.View entering={FadeInDown.duration(600)}>
            <Text className="text-3xl font-bold text-slate-900 mb-2">
              Kayıt Ol
            </Text>
            <Text className="text-slate-500 mb-8">
              MuslimChat ailesine katıl
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <Input label="Kullanıcı Adı" value={username} onChangeText={setUsername} />
            <Input label="Ad Soyad" value={fullName} onChangeText={setFullName} />
            <Input
              label="E-posta"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? (
              <Text className="text-red-500 mb-4">{error}</Text>
            ) : null}
            <Button
              label="Kayıt Ol"
              onPress={handleRegister}
              loading={loading}
              fullWidth
            />
          </Animated.View>

          <Link href="/(auth)/login" asChild>
            <Text className="text-center text-primary-700 mt-6">
              Zaten hesabın var mı? <Text className="font-bold">Giriş yap</Text>
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
