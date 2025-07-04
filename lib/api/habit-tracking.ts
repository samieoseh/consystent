import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { habitsTracking } from "../schema/habits-tracking.schema";
import { HabitTrackingPayload } from "../typings/habits";

export const upsertHabitTracking = async (data: HabitTrackingPayload) => {
  // Check if a record for the given habit and tracking date already exists
  const existingRecord = await db
    .select({
      id: habitsTracking.id,
    })
    .from(habitsTracking)
    .where(
      and(
        eq(habitsTracking.habitId, data.habitId),
        eq(habitsTracking.trackingDate, data.trackingDate)
      )
    );

  console.log({ existingRecord });
  if (existingRecord.length > 0) {
    // Update the existing record
    console.log("updating existing");
    await db
      .update(habitsTracking)
      .set({
        status: data.status,
        completionDate: data.completionDate,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(habitsTracking.habitId, data.habitId),
          eq(habitsTracking.trackingDate, data.trackingDate)
        )
      );
  } else {
    // Insert a new record

    await db.insert(habitsTracking).values({
      habitId: data.habitId,
      routineId: data.routineId,
      status: data.status,
      trackingDate: data.trackingDate, // Include the tracking date
      completionDate: data.completionDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
};
