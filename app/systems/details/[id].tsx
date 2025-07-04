import { ThemedText } from "@/components/ThemedText";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import RoutineCard from "@/components/ui/RoutineCard";
import { useSystemRoutines, useSystems } from "@/lib/queries/systems";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Displays details for a specific system based on the route parameter.
 *
 * Retrieves the system ID from the URL, fetches the list of systems, and renders a header with the matched system's title.
 */
export default function SystemDetails() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: systems } = useSystems();
  const system = systems?.find((system) => system.id === +id);
  const today = new Date().toDateString();

  // fetch the routines for that system
  const { data: systemRoutines } = useSystemRoutines(id);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      edges={["top", "left", "right"]}
    >
      <Container>
        <Header title={""} enableArrowBack></Header>

        <View className="py-6 flex flex-col gap-8">
          <View>
            <ThemedText
              style={{
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {system?.title}
            </ThemedText>
            {system?.description && (
              <ThemedText
                style={{ color: colors.outlineVariant, fontSize: 12 }}
              >
                {system.description}
              </ThemedText>
            )}

            <View className="flex flex-row gap-4">
              <View className="flex flex-row gap-2 items-center">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color={colors.outlineVariant}
                />
                <ThemedText
                  style={{ fontSize: 12, color: colors.outlineVariant }}
                >
                  {system?.cadence === "daily"
                    ? "Every day"
                    : system?.cadence === "weekdays"
                      ? "Mon - Fri"
                      : "Custom"}
                </ThemedText>
              </View>

              <View className="flex flex-row gap-2 items-center">
                <MaterialCommunityIcons
                  name="progress-check"
                  size={18}
                  color={colors.outlineVariant}
                />
                <ThemedText
                  style={{ fontSize: 12, color: colors.outlineVariant }}
                >
                  {system?.routineCount} routine
                  {system && system?.routineCount > 1 ? "s" : ""}
                </ThemedText>
              </View>

              <View className="flex flex-row gap-2 items-center">
                <MaterialCommunityIcons
                  name="repeat"
                  size={18}
                  color={colors.outlineVariant}
                />
                <ThemedText
                  style={{ fontSize: 12, color: colors.outlineVariant }}
                >
                  {0} process
                </ThemedText>
              </View>
            </View>
          </View>

          <View>
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Today's Routine
            </ThemedText>

            <View className="py-6">
              {systemRoutines && systemRoutines.length > 0 ? (
                <View>
                  {systemRoutines.map((routine) => (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      date={today}
                    />
                  ))}
                </View>
              ) : (
                <View className="flex items-center justify-center py-6">
                  <MaterialCommunityIcons
                    name="calendar-remove"
                    size={48}
                    color={colors.outlineVariant} // Use a subtle color for the icon
                  />
                  <ThemedText
                    style={{
                      color: colors.outlineVariant,
                      textAlign: "center",
                      fontSize: 13,
                      marginTop: 8, // Add spacing between the icon and text
                    }}
                  >
                    No routine for today
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        </View>
      </Container>
    </SafeAreaView>
  );
}
