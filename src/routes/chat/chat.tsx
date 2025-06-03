import { getDb } from "@/db/client";

import { Chat } from "./chat.client";

export default async function ChatRoute({
  params: { chatId },
}: {
  params: { chatId?: string };
}) {
  const db = await getDb();

  const messages = chatId
    ? await db.query.chatMessage.findMany({
        with: {
          attachments: true,
        },
        orderBy: (chatMessage, { asc }) => asc(chatMessage.createdAt),
        where: (chatMessage, { eq }) => eq(chatMessage.chatId, chatId),
      })
    : [];

  return (
    <Chat
      key={chatId}
      chatId={chatId}
      initialMessages={messages.map((message) => ({
        content: message.content,
        id: message.id,
        role: message.role as any,
        createdAt: new Date(message.createdAt),
        experimental_attachments: message.attachments.map((attachment) => ({
          name: attachment.name ?? null,
          contentType: attachment.contentType ?? null,
          url: attachment.url,
        })),
      }))}
    />
  );
}
