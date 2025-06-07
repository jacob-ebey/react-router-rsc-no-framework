import { createOpenAI } from "@ai-sdk/openai";
// import type { FetchHandler } from "@mjackson/node-fetch-server";
import { appendResponseMessages, generateText, streamText } from "ai";
import type { ActionFunctionArgs } from "react-router";
import { env } from "std-env";

import { getUserId, requireAuthMiddleware } from "@/auth/middleware";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";

export const unstable_middleware = [requireAuthMiddleware];

export async function action({request}: ActionFunctionArgs) {
  const db = getDb();

  const userId = getUserId();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id, messages } = await request.json();

  const existingChat = await db.query.chat.findFirst({
    columns: { userId: true },
    where: (chat, { eq }) => eq(chat.id, id),
  });

  if (existingChat && existingChat.userId !== userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY,
    baseURL: env.OPENAI_API_BASE,
    compatibility: "compatible",
  });

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    onFinish: async ({ response }) => {
      if (!existingChat) {
        const { text: title } = await generateText({
          model: openai("gpt-4o-mini"),
          system: `- you will generate a short title based on the first message a user begins a conversation with
- ensure it is not more than 80 characters long
- the title should be a summary of the user's message
- do not use quotes or colons`,
          maxTokens: 80,
          prompt: JSON.stringify(messages[0]),
        });

        await db.insert(schema.chat).values({
          id,
          title,
          userId,
        });
      }

      const responseMessages = appendResponseMessages({
        messages,
        responseMessages: response.messages,
      });

      for (const msg of responseMessages.slice(messages.length - 1)) {
        const [inserted] = await db
          .insert(schema.chatMessage)
          .values({
            id: msg.id,
            content: msg.content,
            role: msg.role,
            modelId: response.modelId,
            chatId: id,
          })
          .returning({ id: schema.chatMessage.id });

        for (const attachment of msg.experimental_attachments ?? []) {
          await db.insert(schema.chatMessageAttachment).values({
            name: attachment.name,
            contentType: attachment.contentType,
            url: attachment.url,
            chatMessageId: inserted.id,
          });
        }
      }
    },
  });

  return result.toDataStreamResponse({
    getErrorMessage(error) {
      console.error("Error in AI response:", error);
      return "An error occurred.";
    },
  });
}

// export const handler: FetchHandler = async (request) => {
//   return authMiddleware(
//     { params: {}, context: {} as any, request },
//     async (): Promise<Response> => {
//       const db = getDb();

//       const userId = getUserId();
//       if (!userId) {
//         return new Response("Unauthorized", { status: 401 });
//       }

//       const { id, messages } = await request.json();

//       const existingChat = await db.query.chat.findFirst({
//         columns: { userId: true },
//         where: (chat, { eq }) => eq(chat.id, id),
//       });

//       if (existingChat && existingChat.userId !== userId) {
//         return new Response("Unauthorized", { status: 401 });
//       }

//       const openai = createOpenAI({
//         apiKey: env.OPENAI_API_KEY,
//         baseURL: env.OPENAI_API_BASE,
//         compatibility: "compatible",
//       });

//       const result = streamText({
//         model: openai("gpt-4o-mini"),
//         messages,
//         onFinish: async ({ response }) => {
//           if (!existingChat) {
//             const { text: title } = await generateText({
//               model: openai("gpt-4o-mini"),
//               system: `- you will generate a short title based on the first message a user begins a conversation with
// - ensure it is not more than 80 characters long
// - the title should be a summary of the user's message
// - do not use quotes or colons`,
//               maxTokens: 80,
//               prompt: JSON.stringify(messages[0]),
//             });

//             await db.insert(schema.chat).values({
//               id,
//               title,
//               userId,
//             });
//           }

//           const responseMessages = appendResponseMessages({
//             messages,
//             responseMessages: response.messages,
//           });

//           for (const msg of responseMessages.slice(messages.length - 1)) {
//             const [inserted] = await db
//               .insert(schema.chatMessage)
//               .values({
//                 id: msg.id,
//                 content: msg.content,
//                 role: msg.role,
//                 modelId: response.modelId,
//                 chatId: id,
//               })
//               .returning({ id: schema.chatMessage.id });

//             for (const attachment of msg.experimental_attachments ?? []) {
//               await db.insert(schema.chatMessageAttachment).values({
//                 name: attachment.name,
//                 contentType: attachment.contentType,
//                 url: attachment.url,
//                 chatMessageId: inserted.id,
//               });
//             }
//           }
//         },
//       });

//       return result.toDataStreamResponse({
//         getErrorMessage(error) {
//           console.error("Error in AI response:", error);
//           return "An error occurred.";
//         },
//       });
//     }
//   ) as Response;
// };
