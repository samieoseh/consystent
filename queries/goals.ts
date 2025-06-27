import { db } from "@/lib/db";
import { goals } from "@/lib/schema/goal.schema";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "goals";

export const useGoals = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const result = await db.select().from(goals);
      return result;
    },
  });
};
