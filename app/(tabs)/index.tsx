import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import SystemCard from "@/components/ui/SystemCard";
import { useSystemsMutations } from "@/lib/mutations/systems";
import { useSystems } from "@/lib/queries/systems";
import { System } from "@/lib/typings/systems";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, useColorScheme, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexPage() {
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

  const today = format(new Date(), "EEEE");

  const filteredSystems = systems?.filter((system) => {
    if (system.cadence === "daily") {
      return true;
    }
    if (
      system.cadence === "weekdays" &&
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(today)
    ) {
      return true;
    }
    if (
      Array.isArray(JSON.parse(system.specificDays ?? "[]")) &&
      JSON.parse(system.specificDays ?? "[]").includes(today)
    ) {
      return true;
    }
    return false;
  });

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
      <ScrollView>
        <Container>
          <Header title={"Good Afternoon"}></Header>
          <ThemedView className="relative flex-1 pt-4 gap-8" lightColor="#fff">
            <View
              className="py-4 px-8 rounded-lg flex flex-col gap-1"
              style={{
                backgroundColor: colors.surface,
              }}
            >
              <ThemedText
                style={{ color: colors.onSurfaceVariant, fontSize: 13 }}
              >
                Today's Overview
              </ThemedText>
              <View className="flex flex-row justify-around">
                <View className="flex items-center py-4 justify-between gap-2">
                  <ThemedText
                    style={{
                      color: colors.primary,
                      fontSize: 30,
                      fontWeight: 900,
                    }}
                  >
                    {filteredSystems?.length}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 15 }}>
                    Systems for today
                  </ThemedText>
                </View>

                <View className="flex items-center py-4 justify-between gap-2">
                  <ThemedText
                    style={{ color: "#10B981", fontSize: 30, fontWeight: 900 }}
                  >
                    2
                  </ThemedText>
                  <ThemedText style={{ fontSize: 15 }}>Completed</ThemedText>
                </View>
              </View>
            </View>

            {filteredSystems && filteredSystems?.length > 0 ? (
              <View>
                <ThemedText style={{ fontWeight: 900 }}>
                  Your Systems
                </ThemedText>

                <View className="flex flex-col gap-6 shadow-m  py-4">
                  {filteredSystems?.map((system) => (
                    <SystemCard system={system} key={system.id} />
                  ))}
                </View>
              </View>
            ) : (
              <View className="flex items-center justify-center">
                <ThemedText
                  style={{ color: colors.onSurfaceVariant, fontSize: 13 }}
                >
                  No systems for today
                </ThemedText>
              </View>
            )}
          </ThemedView>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}
