import React, { ReactNode } from "react";
import { View } from "react-native";
import { ThemedView } from "../ThemedView";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <ThemedView className="relative flex-1" lightColor="#FFFBFF">
      <View className="w-[90%] mx-auto py-4 relative flex-1">{children}</View>
    </ThemedView>
  );
}
