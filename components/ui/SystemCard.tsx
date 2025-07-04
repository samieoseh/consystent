import { System } from "@/lib/typings/systems";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { ThemedText } from "../ThemedText";

/**
 * Renders a themed card displaying information about a system, including its title, optional description, cadence, routine count, a static process count, and a hardcoded progress indicator.
 *
 * @param system - The system object containing title, description, cadence, and routine count to display.
 * @returns A React element representing the styled system card.
 */
export default function SystemCard({ system }: { system: System }) {
  const { colors } = useTheme();
  return (
    <View
      style={{ backgroundColor: colors.surface }}
      className="rounded-lg py-4 px-4 flex flex-col gap-4"
    >
      <View>
        <ThemedText style={{ fontSize: 18, fontWeight: 900 }}>
          {system.title}
        </ThemedText>
        {system.description && (
          <ThemedText style={{ color: colors.outlineVariant, fontSize: 12 }}>
            {system.description}
          </ThemedText>
        )}
      </View>

      <View className="flex flex-row gap-4">
        <View className="flex flex-row gap-2 items-center">
          <MaterialCommunityIcons
            name="clock-outline"
            size={18}
            color={colors.outlineVariant}
          />
          <ThemedText style={{ fontSize: 12, color: colors.outlineVariant }}>
            {system.cadence === "daily"
              ? "Every day"
              : system.cadence === "weekdays"
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
          <ThemedText style={{ fontSize: 12, color: colors.outlineVariant }}>
            {system.routineCount} routine{system.routineCount > 1 ? "s" : ""}
          </ThemedText>
        </View>

        <View className="flex flex-row gap-2 items-center">
          <MaterialCommunityIcons
            name="repeat"
            size={18}
            color={colors.outlineVariant}
          />
          <ThemedText style={{ fontSize: 12, color: colors.outlineVariant }}>
            3 processes
          </ThemedText>
        </View>
      </View>

      <View className="flex flex-row justify-between w-full  items-center gap-4">
        <ThemedText
          style={{
            fontSize: 14,
            color: colors.outlineVariant,
            fontWeight: 600,
          }}
        >
          Today's Progress
        </ThemedText>
        <View
          style={{
            flex: 1,
            height: 8,
            backgroundColor: colors.outlineVariant,
            borderRadius: 4,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <View
            style={[
              { height: "100%", backgroundColor: "#10B981", borderRadius: 4 },
              { width: "75%" },
            ]}
          />
        </View>
        <ThemedText
          style={{
            fontSize: 14,
            color: "#10B981",
            fontWeight: "600",
          }}
        >
          75%
        </ThemedText>
      </View>
    </View>
  );
}
