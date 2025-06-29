import { db } from "../db";
import { systems } from "../schema/systems.schema";
import { SystemPayload } from "../typings/systems";

export const createSystem = async (data: SystemPayload) => {
  return await db.insert(systems).values(data).run();
};
