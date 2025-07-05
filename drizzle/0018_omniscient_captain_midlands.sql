PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_routines_tracking` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`routine_id` integer NOT NULL,
	`system_id` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`updated_at` text NOT NULL,
	`tracking_date` text NOT NULL,
	`created_at` text NOT NULL,
	`completedDate` text,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`system_id`) REFERENCES `systems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_routines_tracking`("id", "routine_id", "system_id", "status", "updated_at", "tracking_date", "created_at", "completedDate") SELECT "id", "routine_id", "system_id", "status", "updated_at", "tracking_date", "created_at", "completedDate" FROM `routines_tracking`;--> statement-breakpoint
DROP TABLE `routines_tracking`;--> statement-breakpoint
ALTER TABLE `__new_routines_tracking` RENAME TO `routines_tracking`;--> statement-breakpoint
PRAGMA foreign_keys=ON;