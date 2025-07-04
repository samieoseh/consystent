import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { habits } from "./habits.schema";
import { routines } from "./routines.schema";

export const habitsTracking = sqliteTable("habits_tracking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  habitId: integer("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  routineId: integer("routine_id")
    .notNull()
    .references(() => routines.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // pending, completed, skipped
  updatedAt: text("updated_at").notNull(),
  trackingDate: text("tracking_date").notNull(),
  createdAt: text("created_at").notNull(),
  completionDate: text("completedDate"),
});
