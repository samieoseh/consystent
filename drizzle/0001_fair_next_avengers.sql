ALTER TABLE `users` RENAME TO `goals`;--> statement-breakpoint
ALTER TABLE `goals` RENAME COLUMN "name" TO "title";--> statement-breakpoint
DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `goals` DROP COLUMN `email`;