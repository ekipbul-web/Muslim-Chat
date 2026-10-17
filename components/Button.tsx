import { Pressable, Text, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  fullWidth,
}: Props) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const variants = {
    primary: "bg-primary-700",
    secondary: "bg-slate-100",
    danger: "bg-red-600",
    ghost: "bg-transparent",
  };

  const textColors = {
    primary: "text-white",
    secondary: "text-slate-900",
    danger: "text-white",
    ghost: "text-primary-700",
  };

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.96);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      className={`${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } rounded-2xl py-4 px-6 items-center justify-center ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? "#0F172A" : "#fff"}
        />
      ) : (
        <Text className={`font-bold text-base ${textColors[variant]}`}>
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}
