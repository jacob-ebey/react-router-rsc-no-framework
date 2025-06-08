"use client";

import { useActionState } from "react";

// @ts-expect-error - no types
import Loader from "lucide-react/dist/esm/icons/loader.js";
// @ts-expect-error - no types
import MoreHorizontal from "lucide-react/dist/esm/icons/more-horizontal.js";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";

import { deleteChatAction } from "../actions";

export function ChatDropdown({ chatId }: { chatId: string }) {
  const [, deleteAction, deleting] = useActionState<undefined, FormData>(
    async (_, formData) => {
      const errors = await deleteChatAction(formData);

      if (errors) {
        toast.error("Failed to delete chat.", { position: "top-right" });
      } else {
        toast.success("Chat deleted successfully.", { position: "top-right" });
      }

      return undefined;
    },
    undefined
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction>
          {deleting ? <Loader className="animate-spin" /> : <MoreHorizontal />}
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" asChild>
        <form>
          <input type="hidden" name="chatId" value={chatId} />
          <DropdownMenuItem asChild>
            <button className="w-full" formAction={deleteAction}>
              Delete Chat
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
