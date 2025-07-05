import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertRoutineTracking } from "../api/routine-tracking";
import { ROUTINE_TRACKING_QUERY_KEY } from "../queries/routines-tracking";

export const useRoutinesTrackingMutation = () => {
  const queryClient = useQueryClient();
  const upsertRoutinesTrackingMutation = useMutation({
    mutationFn: upsertRoutineTracking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ROUTINE_TRACKING_QUERY_KEY],
      });
    },
  });

  return { upsertRoutinesTrackingMutation };
};
