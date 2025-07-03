import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoutine } from "../api/routine";
import { SYSTEM_QUERY_KEY } from "../queries/systems";

export const useRoutinesMutation = () => {
  const queryClient = useQueryClient();

  const createRoutineMutation = useMutation({
    mutationFn: createRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SYSTEM_QUERY_KEY,
      });
    },
  });

  return {
    createRoutineMutation,
  };
};
