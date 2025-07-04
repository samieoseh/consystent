import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { habits } from "../schema/habits.schema";
import { routines } from "../schema/routines.schema";

export const ROUTINE_QUERY_KEY = "routines";

export const useRoutines = () => {
  return useQuery({
    queryKey: [ROUTINE_QUERY_KEY],
    queryFn: async () => {
      const result = await db.select().from(routines);
      return result;
    },
  });
};

export const useRoutineHabits = (id: number | null) => {
  return useQuery({
    queryKey: [ROUTINE_QUERY_KEY, "habits", id],
    queryFn: async () => {
      if (!id) return []; // Return an empty array if no ID is provided

      const result = await db
        .select({
          id: habits.id,
          title: habits.title,
          routineId: habits.routineId,
        })
        .from(habits)
        .where(eq(habits.routineId, +id)); // Fetch habits linked to the routine ID

      return result;
    },
  });
};
