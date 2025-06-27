import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import { useGoals } from "@/queries/goals";
import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

export default function IndexPage() {
  const { data: goals, isLoading, isError, error } = useGoals();

  console.log({ goals });

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
    </Container>
  );
}
