import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { routines } from "../schema/routines.schema";

export const ROUTINE_QUERY_KEY = ["routines"];

export const useRoutines = () => {
  return useQuery({
    queryKey: ROUTINE_QUERY_KEY,
    queryFn: async () => {
      const result = await db.select().from(routines);
      return result;
    },
  });
};
