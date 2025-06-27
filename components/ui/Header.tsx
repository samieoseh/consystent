import { darkTheme, lightTheme } from "@/lib/themes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function Header({
  title,
  enableArrowBack = false,
  children,
}: {
  title: string;
  enableArrowBack?: boolean;
  children?: ReactNode;
}) {
  const colorScheme = useColorScheme();
  return (
    <View className="flex flex-row gap-4">
      {enableArrowBack && (
        <Pressable onPress={() => router.back()} className="p-1" hitSlop={10}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={
              colorScheme === "dark"
                ? lightTheme.colors.background
                : darkTheme.colors.background
            }
          />
        </Pressable>
      )}

      <View className="flex flex-1 flex-row items-center gap-4 justify-between">
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: "900",
          }}
        >
          {title}
        </ThemedText>

        <View>{children}</View>
      </View>
    </View>
  );
}
