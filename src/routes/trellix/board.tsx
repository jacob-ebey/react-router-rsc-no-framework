import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router/rsc";
import invariant from "tiny-invariant";

import { requireUserId } from "@/auth/middleware";
import { RouteErrorBoundary } from "@/components/error-boundary";
import { trellixHome } from "@/global-config";
import { badRequest } from "@/lib/http";

import { Board } from "./board.client";
import {
  createColumn,
  deleteCard,
  getBoardData,
  updateBoardName,
  updateColumnName,
  upsertItem,
} from "./queries";
import { INTENTS } from "./types";
import { parseItemMutation } from "./utils";

export async function loader({ request, params }: LoaderFunctionArgs) {
  let accountId = requireUserId(request);

  invariant(params.id, "Missing board ID");
  let id = params.id;

  let board = await getBoardData(id, accountId);
  if (!board) throw redirect(trellixHome);

  return { board };
}

// export const meta: MetaFunction<typeof loader> = ({ data }) => {
//   return [{ title: `${data ? data.board.name : "Board"} | Trellix` }];
// };

export async function action({ request, params }: ActionFunctionArgs) {
  let accountId = requireUserId(request);
  let boardId = params.id;
  invariant(boardId, "Missing boardId");

  let formData = await request.formData();
  let intent = formData.get("intent");

  if (!intent) throw badRequest("Missing intent");

  switch (intent) {
    case INTENTS.deleteCard: {
      let id = String(formData.get("itemId") || "");
      await deleteCard(id, accountId);
      break;
    }
    case INTENTS.updateBoardName: {
      let name = String(formData.get("name") || "");
      invariant(name, "Missing name");
      await updateBoardName(boardId, name, accountId);
      break;
    }
    case INTENTS.moveItem:
    case INTENTS.createItem: {
      let mutation = parseItemMutation(formData);
      await upsertItem({ ...mutation, boardId }, accountId);
      break;
    }
    case INTENTS.createColumn: {
      let { name, id } = Object.fromEntries(formData);
      invariant(name, "Missing name");
      invariant(id, "Missing id");
      await createColumn(boardId, String(name), String(id), accountId);
      break;
    }
    case INTENTS.updateColumn: {
      let { name, columnId } = Object.fromEntries(formData);
      if (!name || !columnId) throw badRequest("Missing name or columnId");
      await updateColumnName(String(columnId), String(name), accountId);
      break;
    }
    default: {
      throw badRequest(`Unknown intent: ${intent}`);
    }
  }

  return { ok: true };
}

export default function BoardRoute() {
  return <Board />;
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
