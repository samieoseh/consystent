ALTER TABLE `habits_tracking` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE `habits_tracking` RENAME COLUMN "createdAt" TO "tracking_date";--> statement-breakpoint
ALTER TABLE `habits_tracking` ADD `created_at` text NOT NULL;