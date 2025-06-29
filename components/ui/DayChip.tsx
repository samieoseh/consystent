import React from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { useTheme } from "react-native-paper";
import { ThemedText } from "../ThemedText";

export default function DayChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const color =
    colorScheme === "dark"
      ? "rgba(100, 170, 255, 0.16)"
      : "rgba(30, 110, 255, 0.12)";

  return (
    <Pressable onPress={onPress}>
      <View
        className="rounded-full h-10 w-10 flex items-center justify-center"
        style={{
          backgroundColor: selected ? colors.primary : color,
        }}
      >
        <ThemedText style={{ fontSize: 12, color: "#fff" }}>{label}</ThemedText>
      </View>
    </Pressable>
  );
}
