import { MessageSquare, Plus } from "lucide-react";
import { Link } from "react-router";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getDb } from "@/db/client";
import { getUserId } from "@/middleware/auth";
import { chatHome } from "@/global-config";

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
            <SidebarMenuButton className="truncate" title={title} asChild>
              <Link to={`${chatHome}/${id}`}>
                <MessageSquare /> {title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
