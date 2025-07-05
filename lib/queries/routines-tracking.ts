import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { routinesTracking } from "../schema/routines-tracking.schema";

export const ROUTINE_TRACKING_QUERY_KEY = "routines-tracking";

export const useRoutinesTracking = (date: string) => {
  return useQuery({
    queryKey: [ROUTINE_TRACKING_QUERY_KEY],
    queryFn: async () => {
      const result = await db
        .select()
        .from(routinesTracking)
        .where(eq(routinesTracking.trackingDate, date));

      return result;
    },
  });
};
