ALTER TABLE `habits_tracking` RENAME COLUMN "completedAt" TO "completedDate";--> statement-breakpoint
ALTER TABLE `habits_tracking` ADD `routine_id` integer NOT NULL REFERENCES routines(id);