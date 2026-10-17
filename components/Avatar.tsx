import { View, Text, Image } from "react-native";
import { UserRole } from "@/lib/roles";
import { RoleBadge } from "./RoleBadge";

type Props = {
  uri?: string | null;
  name?: string;
  size?: number;
  role?: UserRole;
  online?: boolean;
};

export function Avatar({ uri, name, size = 48, role, online }: Props) {
  const initials = (name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <View
          style={{ width: size, height: size, borderRadius: size / 2 }}
          className="bg-primary-700 items-center justify-center"
        >
          <Text
            className="text-white font-bold"
            style={{ fontSize: size * 0.35 }}
          >
            {initials}
          </Text>
        </View>
      )}
      {online && (
        <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
      {role && role !== "user" && (
        <View className="absolute -bottom-1 -right-1">
          <RoleBadge role={role} small />
        </View>
      )}
    </View>
  );
}
