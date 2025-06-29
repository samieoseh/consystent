import React, { ReactNode } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "../ThemedView";

export default function Container({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      edges={["top", "left", "right"]}
    >
      <ThemedView className="relative flex-1 pt-4" lightColor="#fff">
        <View className="w-[90%] mx-auto relative flex-1">{children}</View>
      </ThemedView>
    </SafeAreaView>
  );
}
