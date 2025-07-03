import { eq } from "drizzle-orm";
import { db } from "../db";
import { systems } from "../schema/systems.schema";
import { SystemPayload } from "../typings/systems";

// CREATE
export const createSystem = async (data: SystemPayload) => {
  return await db.insert(systems).values(data).returning();
};

// READ (all)
export const getAllSystems = async () => {
  return await db.select().from(systems).all();
};

// READ (by ID)
export const getSystemById = async (id: number) => {
  return await db.select().from(systems).where(eq(systems.id, id)).get();
};

// UPDATE
export const updateSystem = async (
  id: number,
  data: Partial<SystemPayload>
) => {
  return await db
    .update(systems)
    .set(data)
    .where(eq(systems.id, id))
    .returning();
};

// DELETE
export const deleteSystem = async (id: number | undefined) => {
  if (!id) {
    return null;
  }
  return await db.delete(systems).where(eq(systems.id, id)).run();
};
