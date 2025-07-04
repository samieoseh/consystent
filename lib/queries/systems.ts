import { db } from "@/lib/db";
import { systems } from "@/lib/schema/systems.schema";
import { useQuery } from "@tanstack/react-query";
import { eq, sql } from "drizzle-orm";
import { routines } from "../schema/routines.schema";

export const SYSTEM_QUERY_KEY = ["systems"];

export const useSystems = () => {
  return useQuery({
    queryKey: SYSTEM_QUERY_KEY,
    queryFn: async () => {
      const result = await db
        .select({
          id: systems.id,
          title: systems.title,
          description: systems.description,
          cadence: systems.cadence,
          specificDays: systems.specificDays,
          startDate: systems.startDate,
          endDate: systems.endDate,
          isActive: systems.isActive,
          routineCount: sql<number>`COUNT(${routines.id})`.as("routineCount"),
        })
        .from(systems)
        .leftJoin(routines, eq(systems.id, routines.systemId))
        .groupBy(systems.id);

      return result;
    },
  });
};
