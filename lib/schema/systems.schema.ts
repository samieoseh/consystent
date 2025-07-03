// src/lib/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const systems = sqliteTable("systems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  startDate: text("startDate"),
  endDate: text("endDate"),
  cadence: text("cadence"), // e.g., "daily", "weekly", "specific", "custom"
  isActive: integer("isActive").default(1),
  specificDays: text("specificDays"),
});
