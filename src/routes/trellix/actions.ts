"use server";

import * as v from "valibot";

import { deleteBoard } from "./queries";
import { getUserId } from "@/auth/middleware";

const DeleteBoardSchema = v.object({
  boardId: v.string("Board ID is required."),
});

export type DeleteBoardState = v.FlatErrors<typeof DeleteBoardSchema>;

export async function deleteBoardAction(
  formData: FormData
): Promise<DeleteBoardState | undefined> {
  const userId = getUserId();

  if (!userId) {
    return {
      other: ["Not authenticated."],
    };
  }
  const parsed = v.safeParse(DeleteBoardSchema, Object.fromEntries(formData));
  if (!parsed.success) {
    return v.flatten<typeof DeleteBoardSchema>(parsed.issues);
  }

  await deleteBoard(parsed.output.boardId, userId);
}
