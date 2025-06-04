"use client";

import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router";

import { Button } from "@/components/ui/button";

import { Label, LabeledInput } from "./components/input";
import { INTENTS } from "./types";
// @ts-expect-error - no types
import Trash from "lucide-react/dist/esm/icons/trash.js";

import type { loader } from "./home";
import { trellixHome } from "@/global-config";

export function Boards() {
  let { boards } = useLoaderData<typeof loader>();
  return (
    <div className="p-8">
      <h2 className="font-bold mb-2 text-xl">Boards</h2>
      <nav className="flex flex-wrap gap-8">
        {boards.map((board) => (
          <Board
            key={board.id}
            name={board.name}
            id={board.id}
            color={board.color}
          />
        ))}
      </nav>
    </div>
  );
}

function Board({
  name,
  id,
  color,
}: {
  name: string;
  id: string;
  color?: string | null;
}) {
  let fetcher = useFetcher();
  let isDeleting = fetcher.state !== "idle";
  return isDeleting ? null : (
    <Link
      to={`${trellixHome}/${id}`}
      className="w-60 h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg bg-white relative"
      style={color ? { borderColor: color } : undefined}
    >
      <div className="font-bold">{name}</div>
      <fetcher.Form method="post">
        <input type="hidden" name="intent" value={INTENTS.deleteBoard} />
        <input type="hidden" name="boardId" value={id} />
        <button
          aria-label="Delete board"
          className="absolute top-4 right-4 hover:text-brand-red"
          type="submit"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Trash />
        </button>
      </fetcher.Form>
    </Link>
  );
}

export function NewBoard() {
  let navigation = useNavigation();
  let isCreating = navigation.formData?.get("intent") === "createBoard";

  return (
    <Form method="post" className="p-8 max-w-md">
      <input type="hidden" name="intent" value="createBoard" />
      <div>
        <h2 className="font-bold mb-2 text-xl">New Board</h2>
        <LabeledInput label="Name" name="name" type="text" required />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Label htmlFor="board-color">Color</Label>
          <input
            id="board-color"
            name="color"
            type="color"
            defaultValue="#cbd5e1"
            className="bg-transparent"
          />
        </div>
        <Button type="submit">{isCreating ? "Creating..." : "Create"}</Button>
      </div>
    </Form>
  );
}
