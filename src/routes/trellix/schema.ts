import { relations, sql } from "drizzle-orm";
import { numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "@/auth/user.schema";

export const board = sqliteTable("board", {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  name: text().notNull(),
  color: text(),
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const boardRelations = relations(board, ({ many, one }) => ({
  cards: many(boardCard),
  columns: many(boardColumn),
  user: one(user, {
    fields: [board.userId],
    references: [user.id],
  }),
}));

export const boardUserRelations = relations(user, ({ many }) => ({
  boards: many(board),
}));

export const boardColumn = sqliteTable("boardColumn", {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  name: text().notNull(),
  order: numeric({ mode: "number" }),
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  boardId: text()
    .notNull()
    .references(() => board.id, { onDelete: "cascade" }),
});

export const boardColumnRelations = relations(boardColumn, ({ many, one }) => ({
  board: one(board, {
    fields: [boardColumn.boardId],
    references: [board.id],
  }),
  cards: many(boardCard),
}));

export const boardCard = sqliteTable("boardCard", {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  title: text().notNull(),
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  order: numeric({ mode: "number" }),
  boardId: text()
    .notNull()
    .references(() => board.id, { onDelete: "cascade" }),
  columnId: text()
    .notNull()
    .references(() => boardColumn.id, { onDelete: "cascade" }),
});

export const boardCardRelations = relations(boardCard, ({ one }) => ({
  board: one(board, {
    fields: [boardCard.boardId],
    references: [board.id],
  }),
  column: one(boardColumn, {
    fields: [boardCard.columnId],
    references: [boardColumn.id],
  }),
}));
