import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router/rsc";

import { requireUserId } from "@/auth/middleware";
import { getDb } from "@/db/client";
import { appName, chatHome } from "@/global-config";

import { Chat } from "./chat.client";

export async function loader({
  params: { chatId },
  request,
}: LoaderFunctionArgs) {
  const userId = requireUserId(request);

  let title: string | undefined;
  if (chatId) {
    const db = getDb();

    const chat = await db.query.chat.findFirst({
      columns: { id: true, title: true },
      where: (chat, { and, eq }) =>
        and(eq(chat.id, chatId), eq(chat.userId, userId)),
    });
    title = chat?.title;
    if (!chat) {
      throw redirect(chatHome);
    }
  }

  return { title };
}

export default async function ChatRoute({
  loaderData: { title },
  params: { chatId },
}: {
  loaderData: { title?: string };
  params: { chatId?: string };
}) {
  const db = getDb();

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
    <>
      <title>{`${title || "Chat"} | ${appName}`}</title>
      <Chat
        key={chatId}
        chatId={chatId}
        initialMessages={messages.map((message) => ({
          content: message.content,
          id: message.id,
          role: message.role as any,
          createdAt: new Date(message.createdAt),
          experimental_attachments: message.attachments.map((attachment) => ({
            name: attachment.name ?? undefined,
            contentType: attachment.contentType ?? undefined,
            url: attachment.url,
          })),
        }))}
      />
    </>
  );
}
