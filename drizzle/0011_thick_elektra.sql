CREATE TABLE `habits_tracking` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`habit_id` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`completionDate` text NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `routines_tracking` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`routine_id` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`completionDate` text NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `systems`(`id`) ON UPDATE no action ON DELETE cascade
);
