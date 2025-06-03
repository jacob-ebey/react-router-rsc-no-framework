"use client";

import type { Message } from "@ai-sdk/react";
import { useChat } from "@ai-sdk/react";

import { Chat as ChatComponent } from "./components/chat";
import { useNavigate } from "react-router";

export function Chat({
  chatId,
  initialMessages,
}: {
  chatId?: string;
  initialMessages?: Message[];
}) {
  const navigate = useNavigate();
  const {
    error,
    handleInputChange,
    handleSubmit,
    id,
    input,
    messages,
    status,
    stop,
  } = useChat({
    id: chatId,
    initialMessages,
    onFinish: () => {
      if (chatId !== id) {
        navigate(`/chat/${id}`, {
          preventScrollReset: true,
          replace: true,
        });
      }
    },
  });

  return (
    <ChatComponent
      error={error}
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      status={status}
      stop={stop}
      className="grow pt-4"
    />
  );
}
