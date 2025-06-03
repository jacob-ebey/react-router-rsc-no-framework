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
import { trellixHome } from "@/global-config";

import { BoardDropdown } from "./nav.client";

export async function TrellixNav() {
  const db = getDb();
  const userId = getUserId();

  const boards = userId
    ? await db.query.board.findMany({
        columns: { id: true, name: true },
        orderBy: (board, { desc }) => desc(board.createdAt),
        where: (board, { eq }) => eq(board.userId, userId),
      })
    : [];

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to={trellixHome}>
              <Plus /> New Board
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarSeparator />
        <SidebarGroupLabel>Boards</SidebarGroupLabel>
        {boards.map(({ id, name }) => (
          <SidebarMenuItem key={id}>
            <SidebarMenuButton title={name} asChild>
              <NavLink to={`${trellixHome}/${id}`}>
                <MessageSquare /> <span className="truncate">{name}</span>
              </NavLink>
            </SidebarMenuButton>
            <BoardDropdown boardId={id} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
