import { useQuery } from "@tanstack/react-query";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { habitsTracking } from "../schema/habits-tracking.schema";

export const HABIT_TRACKING_QUERY_KEY = "habits-tracking";

export const useHabitsTracking = (date: string, routineId: number) => {
  console.log({ date, routineId });
  return useQuery({
    queryKey: [HABIT_TRACKING_QUERY_KEY],
    queryFn: async () => {
      const result = await db
        .select()
        .from(habitsTracking)
        .where(
          and(
            eq(habitsTracking.trackingDate, date),
            eq(habitsTracking.routineId, routineId)
          )
        );

      return result;
    },
  });
};
