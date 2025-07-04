import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { systems } from "./systems.schema";

export const routinesTracking = sqliteTable("routines_tracking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  routineId: integer("routine_id")
    .notNull()
    .references(() => systems.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // pending, completed, skipped
  completionDate: text("completionDate").notNull(),
});
