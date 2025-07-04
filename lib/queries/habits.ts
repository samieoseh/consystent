import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { habits } from "../schema/habits.schema";

export const HABIT_QUERY_KEY = "habits";

export const useHabits = () => {
  return useQuery({
    queryKey: [HABIT_QUERY_KEY],
    queryFn: async () => {
      const result = await db.select().from(habits);
      return result;
    },
  });
};
