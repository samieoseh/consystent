import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { createSystem } from "../api/system";
import { SYSTEM_QUERY_KEY } from "../queries/systems";

export const useSystemsMutations = () => {
  const queryClient = useQueryClient();

  const createSystemMutation = useMutation({
    mutationFn: createSystem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SYSTEM_QUERY_KEY,
      });
      router.push("/system");
    },
  });

  return {
    createSystemMutation,
  };
};
