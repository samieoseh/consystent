import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { systems } from "./systems.schema";

export const routines = sqliteTable("routines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  systemId: integer("system_id")
    .notNull()
    .references(() => systems.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  cadence: text("cadence").notNull(),
  startTime: text("start_time"),
});
