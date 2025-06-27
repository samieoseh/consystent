import React, { ReactNode } from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function Header({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View className="flex items-center justify-between flex-row">
      <ThemedText
        style={{
          fontSize: 20,
          fontWeight: 900,
        }}
      >
        {title}
      </ThemedText>
      <View>{children}</View>
    </View>
  );
}
