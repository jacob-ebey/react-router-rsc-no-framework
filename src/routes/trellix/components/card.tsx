// @ts-expect-error - no types
import Trash from "lucide-react/dist/esm/icons/trash.js";
import { useState } from "react";
import { useFetcher, useSubmit } from "react-router";
import invariant from "tiny-invariant";

import { CONTENT_TYPES, INTENTS, ItemMutation } from "../types";

interface CardProps {
  title: string;
  id: string;
  columnId: string;
  order: number;
  nextOrder: number;
  previousOrder: number;
}

export function Card({
  title,
  id,
  columnId,
  order,
  nextOrder,
  previousOrder,
}: CardProps) {
  let submit = useSubmit();
  let deleteFetcher = useFetcher();

  let [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">("none");

  return deleteFetcher.state !== "idle" ? null : (
    <li
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
          event.preventDefault();
          event.stopPropagation();
          let rect = event.currentTarget.getBoundingClientRect();
          let midpoint = (rect.top + rect.bottom) / 2;
          setAcceptDrop(event.clientY <= midpoint ? "top" : "bottom");
        }
      }}
      onDragLeave={() => {
        setAcceptDrop("none");
      }}
      onDrop={(event) => {
        event.stopPropagation();

        let transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card)
        );
        invariant(transfer.id, "missing cardId");
        invariant(transfer.title, "missing title");

        let droppedOrder = acceptDrop === "top" ? previousOrder : nextOrder;
        let moveOrder = (droppedOrder + order) / 2;

        let mutation: ItemMutation = {
          order: moveOrder,
          columnId: columnId,
          id: transfer.id,
          title: transfer.title,
        };

        submit(
          { ...mutation, intent: INTENTS.moveItem },
          {
            method: "post",
            navigate: false,
            fetcherKey: `card:${transfer.id}`,
          }
        );

        setAcceptDrop("none");
      }}
      className={
        "border-t-2 border-b-2 -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 " +
        (acceptDrop === "top"
          ? "border-t-brand-red border-b-transparent"
          : acceptDrop === "bottom"
            ? "border-b-brand-red border-t-transparent"
            : "border-t-transparent border-b-transparent")
      }
    >
      <div
        draggable
        className="bg-card text-card-foreground shadow-sm rounded-lg w-full pt-4 pb-1 px-4 relative"
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData(
            CONTENT_TYPES.card,
            JSON.stringify({ id, title })
          );
        }}
      >
        <h3>{title}</h3>
        {/* <div className="mt-2">{content || <>&nbsp;</>}</div> */}
        <div className="mt-2">&nbsp;</div>
        <deleteFetcher.Form method="post">
          <input type="hidden" name="intent" value={INTENTS.deleteCard} />
          <input type="hidden" name="itemId" value={id} />
          <button
            aria-label="Delete card"
            className="absolute top-4 right-4 hover:text-brand-red"
            type="submit"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Trash />
          </button>
        </deleteFetcher.Form>
      </div>
    </li>
  );
}
