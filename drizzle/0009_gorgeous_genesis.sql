PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_systems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`startDate` text,
	`endDate` text,
	`cadence` text,
	`isActive` integer DEFAULT 1
);
--> statement-breakpoint
INSERT INTO `__new_systems`("id", "title", "description", "startDate", "endDate", "cadence", "isActive") SELECT "id", "title", "description", "startDate", "endDate", "cadence", "isActive" FROM `systems`;--> statement-breakpoint
DROP TABLE `systems`;--> statement-breakpoint
ALTER TABLE `__new_systems` RENAME TO `systems`;--> statement-breakpoint
PRAGMA foreign_keys=ON;