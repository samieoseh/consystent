import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { routinesTracking } from "../schema/routines-tracking.schema";
import { RoutineTrackingPayload } from "../typings/routines";

export const upsertRoutineTracking = async (data: RoutineTrackingPayload) => {
  // Check if a record for the given habit and tracking date already exists
  const existingRecord = await db
    .select({
      id: routinesTracking.id,
    })
    .from(routinesTracking)
    .where(
      and(
        eq(routinesTracking.routineId, data.routineId),
        eq(routinesTracking.trackingDate, data.trackingDate)
      )
    );

  if (existingRecord.length > 0) {
    // Update the existing record
    await db
      .update(routinesTracking)
      .set({
        status: data.status,
        completionDate: data.completionDate,
        updatedAt: new Date().toISOString(),
        systemId: data.systemId,
      })
      .where(
        and(
          eq(routinesTracking.routineId, data.routineId),
          eq(routinesTracking.trackingDate, data.trackingDate)
        )
      );
  } else {
    // Insert a new record

    await db.insert(routinesTracking).values({
      routineId: data.routineId,
      systemId: data.systemId,
      status: data.status,
      trackingDate: data.trackingDate, // Include the tracking date
      completionDate: data.completionDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
};
