"use server";

import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { actionRequiresUserId } from "@/auth/middleware";
import { and, eq } from "drizzle-orm";
import * as v from "valibot";

const DeleteChatSchema = v.object({
  chatId: v.string("Chat ID is required."),
});

export type DeleteChatState = v.FlatErrors<typeof DeleteChatSchema>;

export async function deleteChatAction(
  formData: FormData
): Promise<DeleteChatState | undefined> {
  const userId = actionRequiresUserId();

  const parsed = v.safeParse(DeleteChatSchema, Object.fromEntries(formData));
  if (!parsed.success) {
    return v.flatten<typeof DeleteChatSchema>(parsed.issues);
  }

  const db = getDb();

  await db
    .delete(schema.chat)
    .where(
      and(
        eq(schema.chat.id, parsed.output.chatId),
        eq(schema.chat.userId, userId)
      )
    );
}
