PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habits_tracking` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`habit_id` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`updated_at` text NOT NULL,
	`tracking_date` text NOT NULL,
	`created_at` text NOT NULL,
	`completedAt` text,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_habits_tracking`("id", "habit_id", "status", "updated_at", "tracking_date", "created_at", "completedAt") SELECT "id", "habit_id", "status", "updated_at", "tracking_date", "created_at", "completedAt" FROM `habits_tracking`;--> statement-breakpoint
DROP TABLE `habits_tracking`;--> statement-breakpoint
ALTER TABLE `__new_habits_tracking` RENAME TO `habits_tracking`;--> statement-breakpoint
PRAGMA foreign_keys=ON;