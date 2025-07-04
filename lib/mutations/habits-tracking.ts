import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertHabitTracking } from "../api/habit-tracking";
import { HABIT_TRACKING_QUERY_KEY } from "../queries/habits-tracking";

export const useHabitsTrackingMutation = () => {
  const queryClient = useQueryClient();
  const upsertHabitsTrackingMutation = useMutation({
    mutationFn: upsertHabitTracking,
    onSuccess: () => {
      console.log("success");
      queryClient.invalidateQueries({
        queryKey: [HABIT_TRACKING_QUERY_KEY],
      });
    },
  });

  return { upsertHabitsTrackingMutation };
};
