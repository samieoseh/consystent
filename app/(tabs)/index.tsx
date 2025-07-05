import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import SystemCard from "@/components/ui/SystemCard";
import { useRoutinesTracking } from "@/lib/queries/routines-tracking";
import { useSystems } from "@/lib/queries/systems";
import { getProgressColor } from "@/lib/utils";
import { format } from "date-fns";
import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Displays a daily overview of systems filtered by their cadence and the current day.
 *
 * Fetches system data, filters it based on whether each system is scheduled for today, and renders an overview with the count of today's systems and completed systems. Displays a list of system cards or a message if no systems are scheduled for today. Handles error states by logging and rendering nothing.
 */
export default function IndexPage() {
  const { colors } = useTheme();
  const { data: systems, isError, error } = useSystems();

  const today = format(new Date(), "EEEE");
  const todayDateString = new Date().toDateString();

  const { data: routinesTracking } = useRoutinesTracking(todayDateString);

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

  const getSystemProgress = useCallback(
    (systemId: number, routineCount: number) => {
      const allCompletedRoutines = routinesTracking?.filter(
        (routineTracking) =>
          routineTracking.systemId === systemId &&
          routineTracking.status === "completed"
      ).length;

      return (
        (allCompletedRoutines && allCompletedRoutines > 0
          ? allCompletedRoutines / routineCount
          : 0) * 100
      );
    },
    [routinesTracking]
  );

  const completedSystemsCount =
    filteredSystems?.filter((system) => {
      const completedRoutineCount = routinesTracking?.filter(
        (tracking) =>
          tracking.systemId === system.id && tracking.status === "completed"
      ).length;

      return (
        completedRoutineCount === system.routineCount && system.routineCount > 0
      );
    }).length ?? 0;

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
                    {completedSystemsCount}
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
                  {filteredSystems?.map((system) => {
                    const progress = getSystemProgress(
                      system.id,
                      system.routineCount
                    );
                    const progressColor = getProgressColor(progress);
                    return (
                      <SystemCard
                        system={system}
                        key={system.id}
                        progress={progress}
                        progressColor={progressColor}
                      />
                    );
                  })}
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
