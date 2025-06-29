// src/lib/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { routines } from "./routines.schema";

export const habits = sqliteTable("habits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  routineId: integer("routine_id")
    .notNull()
    .references(() => routines.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
});
