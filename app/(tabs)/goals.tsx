import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import { darkTheme, lightTheme } from "@/lib/themes";
import { useGoals } from "@/queries/goals";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { IconButton } from "react-native-paper";

export default function Goals() {
  const colorScheme = useColorScheme();
  const { data: goals, isLoading, isError, error } = useGoals();

  if (isError) {
    console.error({ error });
    return null;
  }

  return (
    <Container>
      <Header title={"Goals"}>
        <View className="flex items-center flex-row">
          <IconButton
            icon="magnify"
            size={20}
            onPress={() => console.log("magnify pressed")}
          />
          <IconButton
            icon="filter-variant"
            size={20}
            onPress={() => console.log("filter pressed")}
          />
          {/* <IconButton
            icon="calendar-outline"
            size={20}
            onPress={() => console.log("Calendar pressed")}
          /> */}
          <IconButton
            icon="help-circle-outline"
            size={20}
            onPress={() => console.log("help pressed")}
          />
        </View>
      </Header>

      <Pressable
        className="w-16 h-16 flex items-center justify-center rounded-lg absolute bottom-10 right-5"
        style={{
          backgroundColor:
            colorScheme === "dark"
              ? lightTheme.colors.primary
              : darkTheme.colors.primary,
        }}
        onPress={() => {
          router.push("/goals/new");
        }}
      >
        <MaterialCommunityIcons name="plus" color={"#fff"} size={26} />
      </Pressable>
    </Container>
  );
}
