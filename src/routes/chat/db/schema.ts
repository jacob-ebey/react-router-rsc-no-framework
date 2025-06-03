import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "@/auth/user.schema";

export const chat = sqliteTable("chat", {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  title: text().notNull(),
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const chatRelations = relations(chat, ({ many, one }) => ({
  messages: many(chatMessage),
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
}));

export const chatUserRelations = relations(user, ({ many }) => ({
  chats: many(chat),
}));

export const chatMessage = sqliteTable("chat_message", {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  content: text().notNull(),
  role: text().notNull(),
  modelId: text().notNull(),
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  chatId: text()
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
});

export const chatMessageRelations = relations(chatMessage, ({ many, one }) => ({
  chat: one(chat, {
    fields: [chatMessage.chatId],
    references: [chat.id],
  }),
  attachments: many(chatMessageAttachment),
}));

export const chatMessageAttachment = sqliteTable("chat_message_attachment", {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  name: text(),
  contentType: text(),
  url: text().notNull(),
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  chatMessageId: text()
    .notNull()
    .references(() => chatMessage.id, { onDelete: "cascade" }),
});

export const chatMessageAttachmentRelations = relations(
  chatMessageAttachment,
  ({ one }) => ({
    chatMessage: one(chatMessage, {
      fields: [chatMessageAttachment.chatMessageId],
      references: [chatMessage.id],
    }),
  })
);
