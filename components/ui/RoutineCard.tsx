import { useRoutineHabits } from "@/lib/queries/routines";
import { Routine } from "@/lib/typings/routines";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";
import { ThemedText } from "../ThemedText";

export default function RoutineCard({ routine }: { routine: Routine }) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle dropdown
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [completedHabits, setCompletedHabits] = useState<
    Record<number, boolean>
  >({}); // Track completed habits

  const { data: habits } = useRoutineHabits(expandedId);

  const toggleHabitCompletion = (habitId: number) => {
    setCompletedHabits((prev) => ({
      ...prev,
      [habitId]: !prev[habitId], // Toggle the completion status
    }));
  };

  return (
    <View
      className="p-4 rounded-xl"
      style={{
        backgroundColor: colors.surface,
      }}
    >
      {/* Header Section */}
      <Pressable
        onPress={() => {
          setIsExpanded(!isExpanded);
          setExpandedId(routine.id);
        }}
      >
        <View className="flex justify-between flex-row items-center">
          <ThemedText
            style={{
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {routine.title}
          </ThemedText>

          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"} // Change icon based on state
            color={colors.onSurfaceVariant}
            size={28}
          />
        </View>

        {/* Time Section */}
        <View className="flex flex-row gap-2 items-center mt-2">
          <MaterialCommunityIcons
            name="clock-outline"
            size={18}
            color={colors.outlineVariant}
          />
          <ThemedText style={{ fontSize: 12, color: colors.outlineVariant }}>
            {routine?.startTime}
          </ThemedText>
        </View>
      </Pressable>

      {/* Habits Section */}
      {isExpanded && (
        <View className="mt-4">
          <ThemedText
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: colors.onSurfaceVariant,
              marginBottom: 8,
            }}
          >
            Habits:
          </ThemedText>
          {habits && habits?.length > 0 ? (
            habits.map((habit, index) => (
              <View
                key={index}
                className="flex flex-row gap-2 items-center mb-2"
              >
                <Checkbox
                  status={completedHabits[habit.id] ? "checked" : "unchecked"}
                  onPress={() => toggleHabitCompletion(habit.id)}
                  color={colors.primary}
                />
                <ThemedText
                  style={{
                    fontSize: 13,
                    color: colors.onSurface,
                    textDecorationLine: completedHabits[habit.id]
                      ? "line-through"
                      : "none", // Strike out if completed
                  }}
                >
                  {habit.title}
                </ThemedText>
              </View>
            ))
          ) : (
            <ThemedText style={{ fontSize: 12, color: colors.outlineVariant }}>
              No habits available.
            </ThemedText>
          )}
        </View>
      )}
    </View>
  );
}
