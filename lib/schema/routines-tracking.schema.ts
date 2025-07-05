import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { routines } from "./routines.schema";
import { systems } from "./systems.schema";

export const routinesTracking = sqliteTable("routines_tracking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  routineId: integer("routine_id")
    .notNull()
    .references(() => routines.id, { onDelete: "cascade" }),
  systemId: integer("system_id")
    .notNull()
    .references(() => systems.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // pending, completed, skipped
  updatedAt: text("updated_at").notNull(),
  trackingDate: text("tracking_date").notNull(),
  createdAt: text("created_at").notNull(),
  completionDate: text("completedDate"),
});
