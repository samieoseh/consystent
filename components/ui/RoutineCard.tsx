import { useHabitsTrackingMutation } from "@/lib/mutations/habits-tracking";
import { useRoutinesTrackingMutation } from "@/lib/mutations/routines-tracking";
import { useHabitsTracking } from "@/lib/queries/habits-tracking";
import { useRoutineHabits } from "@/lib/queries/routines";
import { Routine } from "@/lib/typings/routines";
import { getProgressColor } from "@/lib/utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
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
  const { upsertRoutinesTrackingMutation } = useRoutinesTrackingMutation();

  const [isExpanded, setIsExpanded] = useState(false); // State to toggle dropdown
  const [completedHabits, setCompletedHabits] = useState<
    Record<number, boolean>
  >({}); // Track completed habits

  const { data: habits } = useRoutineHabits(routine.id);
  const {
    data: habitsTracking,
    isLoading: isLoadingTracking,
    error: trackingError,
  } = useHabitsTracking(date, routine.id);

  const toggleHabitCompletion = (habitId: number) => {
    const isCompleted = !completedHabits[habitId];

    const updated = {
      ...completedHabits,
      [habitId]: isCompleted,
    };

    setCompletedHabits(updated);

    upsertHabitsTrackingMutation.mutate(
      {
        habitId,
        routineId: routine.id,
        status: isCompleted ? "completed" : "pending",
        trackingDate: date,
        completionDate: isCompleted
          ? new Date().toISOString().split("T")[0]
          : null,
      },
      {
        onSuccess: () => {
          const allCompleted = Object.values(updated).every((v) => v);
          const routineStatus = allCompleted ? "completed" : "pending";
          console.log({ routineStatus });

          upsertRoutinesTrackingMutation.mutate({
            routineId: routine.id,
            systemId: routine.systemId,
            completionDate:
              routineStatus === "completed"
                ? new Date().toISOString().split("T")[0]
                : null,
            trackingDate: date,
            status: routineStatus,
          });
        },
      }
    );
  };

  useEffect(() => {
    const routineHabitTrackings =
      habitsTracking?.filter(
        (habitTracking) => habitTracking.routineId === routine.id
      ) ?? [];

    if (habitsTracking) {
      const updatedCompletedHabits = routineHabitTrackings.reduce(
        (acc: Record<number, boolean>, tracking) => {
          acc[tracking.habitId] = tracking.status === "completed";
          return acc;
        },
        {}
      );
      setCompletedHabits(updatedCompletedHabits);
    }
  }, [habitsTracking, routine.id]);

  const totalHabits = habits?.length || 0;
  const completedCount = Object.values(completedHabits).filter(
    (status) => status
  ).length;
  const progressPercentage =
    totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
  const progressColor = getProgressColor(progressPercentage);

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
        <View className="flex flex-row justify-between items-center">
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

          <View className="flex flex-row items-center gap-2">
            <AnimatedCircularProgress
              size={20}
              width={4}
              fill={progressPercentage}
              tintColor={progressColor}
              backgroundColor="transparent"
            />
            <ThemedText
              style={{
                fontSize: 12,
                color: progressColor,
              }}
            >
              {progressPercentage.toFixed(0)}%
            </ThemedText>
          </View>
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
                  color={"#10B981"}
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
