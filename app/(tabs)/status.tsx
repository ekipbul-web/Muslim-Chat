import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Status() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-4 py-4">
        <Text className="text-3xl font-bold text-slate-900">Durum</Text>
      </View>
      <View className="items-center py-20">
        <Text className="text-6xl mb-4">📸</Text>
        <Text className="text-slate-500 text-lg">Yakında</Text>
        <Text className="text-slate-400 text-sm mt-1">
          24 saatlik durum paylaşımı
        </Text>
      </View>
    </SafeAreaView>
  );
}
