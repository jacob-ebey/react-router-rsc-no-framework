"use client";

import { useActionState } from "react";

// @ts-expect-error - no types
import Loader from "lucide-react/dist/esm/icons/loader.js";
// @ts-expect-error - no types
import MoreHorizontal from "lucide-react/dist/esm/icons/more-horizontal.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";

import { deleteBoardAction } from "../actions";
import { toast } from "sonner";

export function BoardDropdown({ boardId }: { boardId: string }) {
  const [_, deleteAction, deleting] = useActionState<undefined, FormData>(
    async (_, formData) => {
      const errors = await deleteBoardAction(formData);

      if (errors) {
        toast.error(errors.other?.join(" ") || "Failed to delete board.", {
          position: "top-right",
        });
      } else {
        toast.success("Board deleted successfully.", { position: "top-right" });
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
          <input type="hidden" name="boardId" value={boardId} />
          <DropdownMenuItem asChild>
            <button className="w-full" formAction={deleteAction}>
              Delete Board
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
