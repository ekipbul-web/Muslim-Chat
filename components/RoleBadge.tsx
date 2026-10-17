import { View, Text } from "react-native";
import { ROLE_LABELS, ROLE_COLORS, UserRole } from "@/lib/roles";

export function RoleBadge({ role, small }: { role: UserRole; small?: boolean }) {
  if (role === "user") return null;
  return (
    <View
      style={{ backgroundColor: ROLE_COLORS[role] }}
      className={`rounded-full ${small ? "px-1.5 py-0.5" : "px-2 py-1"}`}
    >
      <Text
        className={`text-white font-bold ${
          small ? "text-[8px]" : "text-xs"
        }`}
      >
        {ROLE_LABELS[role]}
      </Text>
    </View>
  );
}
