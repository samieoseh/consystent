import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import { darkAlhpa, lightAlhpa } from "@/lib/constants";
import { useSystems } from "@/lib/queries/systems";
import { darkTheme, lightTheme } from "@/lib/themes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, useColorScheme, View } from "react-native";
import { IconButton, TouchableRipple, useTheme } from "react-native-paper";

export default function System() {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const { data: systems, isLoading, isError, error } = useSystems();

  if (isError) {
    console.error({ error });
    return null;
  }

  return (
    <Container>
      <Header title={"Systems"}>
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

          <IconButton
            icon="help-circle-outline"
            size={20}
            onPress={() => console.log("help pressed")}
          />
        </View>
      </Header>
      <FlatList
        data={systems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingBottom: 100, // so it doesn’t get hidden behind FAB
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <TouchableRipple
              onPress={() => {}}
              onLongPress={() => {
                console.log("Long press");
              }}
              className="py-4 rounded-xl flex-row items-center justify-between"
              style={{
                borderBlockColor: colors.outline,
              }}
              rippleColor="rgba(0, 0, 0, .32)"
            >
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <View>
                    <ThemedText
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: colors.onSurface,
                      }}
                    >
                      {item.title}
                    </ThemedText>
                    <View className="flex flex-row items-center gap-2 mt-2">
                      <View
                        style={{
                          backgroundColor: colors.outline,
                          borderRadius: 4,
                          paddingHorizontal: 8,
                          paddingVertical: 1,
                          width: 50,
                        }}
                        className="flex items-center justify-center flex-row gap-1"
                      >
                        <Text
                          style={{
                            color: colors.onSurfaceVariant,
                            fontSize: 10,
                            paddingVertical: 2,
                          }}
                        >
                          {item.routineCount} routine
                          {item.routineCount > 1 ? "s" : ""}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor:
                            colorScheme === "dark"
                              ? darkAlhpa.primary
                              : lightAlhpa.primary,
                          borderRadius: 4,
                          paddingHorizontal: 8,
                          paddingVertical: 1,
                          width: 55,
                        }}
                        className="flex items-center justify-center flex-row gap-1"
                      >
                        <MaterialCommunityIcons
                          name="repeat-variant"
                          size={12}
                          color={colors.primary}
                        />
                        <Text
                          style={{
                            color: colors.primary,
                            fontSize: 10,
                            paddingVertical: 2,
                          }}
                        >
                          {item.cadence === "daily"
                            ? "Every day"
                            : item.cadence === "weekdays"
                              ? "Mon - Fri"
                              : "Custom"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableRipple>
            <View
              style={{
                height: 1,
                backgroundColor: colors.outline,
                width: "100%",
              }}
            />
          </View>
        )}
      />

      <Pressable
        className="w-16 h-16 flex items-center justify-center rounded-lg absolute bottom-10 right-5"
        style={{
          backgroundColor:
            colorScheme === "dark"
              ? darkTheme.colors.primary
              : lightTheme.colors.primary,
        }}
        onPress={() => {
          router.push("/systems/new-system");
        }}
      >
        <MaterialCommunityIcons name="plus" color={"#fff"} size={26} />
      </Pressable>
    </Container>
  );
}
