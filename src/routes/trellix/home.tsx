import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router/rsc";

import { requireUserId } from "@/auth/middleware";
import { appName, trellixHome } from "@/global-config";
import { badRequest } from "@/lib/http";

import { Boards, NewBoard } from "./home.client";
import { createBoard, deleteBoard, getHomeData } from "./queries";
import { INTENTS } from "./types";

export async function loader({ request }: LoaderFunctionArgs) {
  let userId = requireUserId(request);
  let boards = await getHomeData(userId);
  return { boards };
}

export async function action({ request }: ActionFunctionArgs) {
  let accountId = await requireUserId(request);
  let formData = await request.formData();
  let intent = String(formData.get("intent"));
  switch (intent) {
    case INTENTS.createBoard: {
      let name = String(formData.get("name") || "");
      let color = String(formData.get("color") || "");
      if (!name) throw badRequest("Bad request");
      let board = await createBoard(accountId, name, color);
      return redirect(`${trellixHome}/${board.id}`);
    }
    case INTENTS.deleteBoard: {
      let boardId = formData.get("boardId");
      if (!boardId) throw badRequest("Missing boardId");
      await deleteBoard(String(boardId), accountId);
      return { ok: true };
    }
    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }
}

export default function Projects() {
  return (
    <div className="h-full">
      <title>{`Boards | ${appName}`}</title>
      <NewBoard />
      <Boards />
    </div>
  );
}
