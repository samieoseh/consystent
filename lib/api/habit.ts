import { db } from "../db";
import { habits } from "../schema/habits.schema";
import { HabitPayload } from "../typings/habits";

export const createHabit = async (data: HabitPayload) => {
  await db.insert(habits).values(data).run();
};
