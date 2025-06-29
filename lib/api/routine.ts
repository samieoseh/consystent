import { db } from "../db";
import { routines } from "../schema/routines.schema";
import { RoutinePayload } from "../typings/routines";

export const createRoutine = async (data: RoutinePayload) => {
  return await db.insert(routines).values(data).run();
};
