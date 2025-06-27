// src/lib/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
});
