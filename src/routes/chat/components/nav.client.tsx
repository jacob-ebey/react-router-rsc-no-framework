"use client";

import { Loader, MoreHorizontal } from "lucide-react";
import { useActionState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";

import { deleteChatAction } from "../actions";
import { toast } from "sonner";

export function ChatDropdown({ chatId }: { chatId: string }) {
  const [_, deleteAction, deleting] = useActionState<undefined, FormData>(
    async (_, formData) => {
      const errors = await deleteChatAction(formData);

      if (errors) {
        if (errors.nested?.chatId) {
          toast.error(errors.nested.chatId.join(" "), {
            position: "top-right",
          });
        } else {
          toast.error("Failed to delete chat.", { position: "top-right" });
        }
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
