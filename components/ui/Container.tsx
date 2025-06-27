import React, { ReactNode } from "react";
import { View } from "react-native";
import { ThemedView } from "../ThemedView";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <ThemedView className="h-screen" lightColor="#FFFBFF">
      <View className="w-[90%] mx-auto py-4">{children}</View>
    </ThemedView>
  );
}
