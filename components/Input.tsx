import { TextInput, TextInputProps, View, Text } from "react-native";

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, ...props }: Props) {
  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-slate-600 mb-2 font-medium">{label}</Text>
      )}
      <TextInput
        {...props}
        className={`bg-slate-50 border ${
          error ? "border-red-500" : "border-slate-200"
        } rounded-2xl px-4 py-4 text-slate-900 text-base`}
        placeholderTextColor="#94A3B8"
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
