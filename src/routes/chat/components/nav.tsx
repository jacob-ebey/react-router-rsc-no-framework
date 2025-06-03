import { MessageSquare, Plus } from "lucide-react";
import { Link, NavLink } from "react-router";

import { getUserId } from "@/auth/middleware";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getDb } from "@/db/client";
import { chatHome } from "@/global-config";

import { ChatDropdown } from "./nav.client";

export async function ChatNav() {
  const db = getDb();
  const userId = getUserId();

  const chats = userId
    ? await db.query.chat.findMany({
        columns: { id: true, title: true },
        orderBy: (chat, { desc }) => desc(chat.createdAt),
        where: (chat, { eq }) => eq(chat.userId, userId),
      })
    : [];

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to={chatHome}>
              <Plus /> New Chat
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarSeparator />
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        {chats.map(({ id, title }) => (
          <SidebarMenuItem key={id}>
            <SidebarMenuButton title={title} asChild>
              <NavLink to={`${chatHome}/${id}`}>
                <MessageSquare /> <span className="truncate">{title}</span>
              </NavLink>
            </SidebarMenuButton>
            <ChatDropdown chatId={id} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
