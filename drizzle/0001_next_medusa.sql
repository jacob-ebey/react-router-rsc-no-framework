CREATE TABLE `board` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `boardCard` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`order` numeric,
	`boardId` text NOT NULL,
	`columnId` text NOT NULL,
	FOREIGN KEY (`boardId`) REFERENCES `board`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`columnId`) REFERENCES `boardColumn`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `boardColumn` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`order` numeric,
	`createdAt` text DEFAULT (current_timestamp) NOT NULL,
	`boardId` text NOT NULL,
	FOREIGN KEY (`boardId`) REFERENCES `board`(`id`) ON UPDATE no action ON DELETE cascade
);
