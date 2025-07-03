import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/ui/Header";
import { darkAlhpa, lightAlhpa } from "@/lib/constants";
import { useSystemsMutations } from "@/lib/mutations/systems";
import { useSystems } from "@/lib/queries/systems";
import { darkTheme, lightTheme } from "@/lib/themes";
import { System } from "@/lib/typings/systems";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, Pressable, Text, useColorScheme, View } from "react-native";
import { IconButton, TouchableRipple, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SystemScreen() {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const { data: systems, isError, error } = useSystems();
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);

  const { deleteSystemMutation } = useSystemsMutations();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedSystem(null);
    }
  }, []);

  const handleSheetClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  if (isError) {
    console.error({ error });
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      edges={["top", "left", "right"]}
    >
      <ThemedView className="relative flex-1 pt-4" lightColor="#fff">
        <View className="w-[95%] mx-auto relative flex-1">
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
                    setSelectedSystem(item);
                    handlePresentModalPress();
                  }}
                  className="py-2 px-4 rounded-xl flex-row items-center justify-between"
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
                              width: 70,
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
                              width: 65,
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
        </View>
      </ThemedView>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          snapPoints={["50%"]}
          index={1}
          containerStyle={{
            zIndex: 1000,
          }}
          backgroundStyle={{
            backgroundColor: colors.surface,
          }}
          handleIndicatorStyle={{
            backgroundColor: colors.onSurfaceVariant,
          }}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
        >
          <BottomSheetScrollView
            style={{
              flex: 1,
              paddingHorizontal: 0,
              paddingVertical: 0,
            }}
            contentContainerStyle={{ height: "100%" }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex  flex-col h-full">
              <View>
                <View className="py-3 px-4">
                  <ThemedText style={{ fontWeight: 900 }}>
                    {selectedSystem?.title}
                  </ThemedText>
                  <View
                    style={{
                      backgroundColor:
                        colorScheme === "dark"
                          ? darkAlhpa.primary
                          : lightAlhpa.primary,
                      borderRadius: 4,
                      paddingHorizontal: 8,
                      paddingVertical: 1,
                      width: 70,
                    }}
                    className="flex items-center justify-center flex-row gap-1"
                  >
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 9,
                        paddingVertical: 2,
                      }}
                    >
                      {selectedSystem?.cadence === "daily"
                        ? "Every day"
                        : selectedSystem?.cadence === "weekdays"
                          ? "Mon - Fri"
                          : "Custom"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.outline,
                    width: "100%",
                  }}
                />
                <View className="px-4 flex flex-row">
                  <View className="flex-1 py-4 items-center justify-center">
                    <View
                      className="h-8 w-8 flex items-center justify-center"
                      style={{
                        backgroundColor: darkAlhpa.secondary,
                        borderRadius: 100,
                      }}
                    >
                      <ThemedText
                        style={{
                          color: colors.secondary,
                        }}
                      >
                        {selectedSystem?.routineCount}
                      </ThemedText>
                    </View>
                    <ThemedText
                      style={{ fontSize: 11, color: colors.onSurface }}
                    >
                      Routines
                    </ThemedText>
                  </View>
                  <View
                    style={{
                      height: "100%",
                      backgroundColor: colors.outline,
                      width: 1,
                    }}
                  />
                  <View className="flex-1 py-4 items-center justify-center">
                    <View
                      className="h-8 w-8 flex items-center justify-center"
                      style={{
                        backgroundColor: darkAlhpa.primary,
                        borderRadius: 100,
                      }}
                    >
                      <ThemedText
                        style={{
                          color: colors.primary,
                        }}
                      >
                        4
                      </ThemedText>
                    </View>
                    <ThemedText
                      style={{ fontSize: 11, color: colors.onSurface }}
                    >
                      Processes
                    </ThemedText>
                  </View>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.outline,
                    width: "100%",
                  }}
                />
              </View>
              <View className="py-3 flex justify-between gap-2 h-[50%]">
                <TouchableRipple
                  className="py-3"
                  rippleColor="rgba(0, 0, 0, .32)"
                  onPress={() => {
                    // TODO: Handle Edit
                  }}
                >
                  <View className="flex-row items-center gap-3 px-4">
                    <MaterialCommunityIcons
                      name="pencil-outline"
                      size={18}
                      color={colors.onSurface}
                    />
                    <ThemedText
                      style={{ fontSize: 14, color: colors.onSurface }}
                    >
                      Edit
                    </ThemedText>
                  </View>
                </TouchableRipple>

                <TouchableRipple
                  className="py-3"
                  rippleColor="rgba(0, 0, 0, .32)"
                  onPress={() => {
                    // TODO: Handle Duplicate
                  }}
                >
                  <View className="flex-row items-center gap-3 px-4">
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={18}
                      color={colors.onSurface}
                    />
                    <ThemedText
                      style={{ fontSize: 14, color: colors.onSurface }}
                    >
                      Duplicate
                    </ThemedText>
                  </View>
                </TouchableRipple>

                <TouchableRipple
                  className="py-3"
                  rippleColor="rgba(0, 0, 0, .32)"
                  onPress={() => {
                    // TODO: Handle Delete
                    deleteSystemMutation.mutate(selectedSystem?.id);
                    handleSheetClose();
                  }}
                >
                  <View className="flex-row items-center gap-3 px-4">
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={18}
                      color={colors.onSurface}
                    />
                    <ThemedText
                      style={{ fontSize: 14, color: colors.onSurface }}
                    >
                      Delete
                    </ThemedText>
                  </View>
                </TouchableRipple>

                <TouchableRipple
                  className="py-3"
                  rippleColor="rgba(0, 0, 0, .32)"
                  onPress={() => {
                    // TODO: Handle View Details
                  }}
                >
                  <View className="flex-row items-center gap-3 px-4">
                    <MaterialCommunityIcons
                      name="eye-outline"
                      size={18}
                      color={colors.onSurface}
                    />
                    <ThemedText
                      style={{ fontSize: 14, color: colors.onSurface }}
                    >
                      View Details
                    </ThemedText>
                  </View>
                </TouchableRipple>

                <TouchableRipple
                  className="py-3"
                  rippleColor="rgba(0, 0, 0, .32)"
                  onPress={() => {
                    // TODO: Handle Mark Inactive
                  }}
                >
                  <View className="flex-row items-center gap-3 px-4">
                    <MaterialCommunityIcons
                      name="close-circle-outline"
                      size={18}
                      color={colors.onSurface}
                    />
                    <ThemedText
                      style={{ fontSize: 14, color: colors.onSurface }}
                    >
                      Mark Inactive
                    </ThemedText>
                  </View>
                </TouchableRipple>
              </View>
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}
