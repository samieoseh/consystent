import { useHabitsTrackingMutation } from "@/lib/mutations/habits-tracking";
import { useHabitsTracking } from "@/lib/queries/habits-tracking";
import { useRoutineHabits } from "@/lib/queries/routines";
import { Routine } from "@/lib/typings/routines";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";
import { ThemedText } from "../ThemedText";

export default function RoutineCard({
  routine,
  date,
}: {
  routine: Routine;
  date: string;
}) {
  const { colors } = useTheme();
  const { upsertHabitsTrackingMutation } = useHabitsTrackingMutation();
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle dropdown
  const [completedHabits, setCompletedHabits] = useState<
    Record<number, boolean>
  >({}); // Track completed habits

  const { data: habits } = useRoutineHabits(isExpanded ? routine.id : null);
  const { data: habitsTracking } = useHabitsTracking(date, routine.id);

  const toggleHabitCompletion = (habitId: number) => {
    const isCompleted = !completedHabits[habitId];

    setCompletedHabits((prev) => ({
      ...prev,
      [habitId]: isCompleted, // Toggle the completion status
    }));

    upsertHabitsTrackingMutation.mutate({
      habitId,
      routineId: routine.id,
      status: isCompleted ? "completed" : "pending",
      trackingDate: new Date().toDateString(),
      completionDate: isCompleted
        ? new Date().toISOString().split("T")[0]
        : null,
    });
  };

  useEffect(() => {
    if (habitsTracking) {
      const updatedCompletedHabits = habitsTracking.reduce(
        (acc: Record<number, boolean>, tracking) => {
          acc[tracking.habitId] = tracking.status === "completed";
          return acc;
        },
        {}
      );
      setCompletedHabits(updatedCompletedHabits);
    }
  }, [habitsTracking]);

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
                key={habit.id}
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
