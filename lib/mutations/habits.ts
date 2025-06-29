import { useMutation } from "@tanstack/react-query";
import { createHabit } from "../api/habit";

export const useHabitsMutation = () => {
  const createHabitMutation = useMutation({
    mutationFn: createHabit,
  });

  return {
    createHabitMutation,
  };
};
