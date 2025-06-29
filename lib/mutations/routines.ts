import { useMutation } from "@tanstack/react-query";
import { createRoutine } from "../api/routine";

export const useRoutinesMutation = () => {
  const createRoutineMutation = useMutation({
    mutationFn: createRoutine,
  });

  return {
    createRoutineMutation,
  };
};
