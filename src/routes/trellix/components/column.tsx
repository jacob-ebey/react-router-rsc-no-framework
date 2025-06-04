// @ts-expect-error - no types
import Plus from "lucide-react/dist/esm/icons/plus.js";
import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import { useSubmit } from "react-router";
import invariant from "tiny-invariant";

import {
  ItemMutation,
  INTENTS,
  CONTENT_TYPES,
  type RenderedItem,
} from "../types";
import { NewCard } from "./new-card";
import { Card } from "./card";
import { EditableText } from "./components";
import { Button } from "@/components/ui/button";

interface ColumnProps {
  name: string;
  columnId: string;
  items: RenderedItem[];
}

export function Column({ name, columnId, items }: ColumnProps) {
  let submit = useSubmit();

  let [acceptDrop, setAcceptDrop] = useState(false);
  let [edit, setEdit] = useState(false);
  let listRef = useRef<HTMLUListElement>(null);

  function scrollList() {
    invariant(listRef.current);
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }

  return (
    <div
      className={
        "flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100 " +
        (acceptDrop ? `outline outline-2 outline-brand-red` : ``)
      }
      onDragOver={(event) => {
        if (
          items.length === 0 &&
          event.dataTransfer.types.includes(CONTENT_TYPES.card)
        ) {
          event.preventDefault();
          setAcceptDrop(true);
        }
      }}
      onDragLeave={() => {
        setAcceptDrop(false);
      }}
      onDrop={(event) => {
        let transfer = JSON.parse(
          event.dataTransfer.getData(CONTENT_TYPES.card)
        );
        invariant(transfer.id, "missing transfer.id");
        invariant(transfer.title, "missing transfer.title");

        let mutation: ItemMutation = {
          order: 1,
          columnId: columnId,
          id: transfer.id,
          title: transfer.title,
        };

        submit(
          { ...mutation, intent: INTENTS.moveItem },
          {
            method: "post",
            navigate: false,
            // use the same fetcher instance for any mutations on this card so
            // that interruptions cancel the earlier request and revalidation
            fetcherKey: `card:${transfer.id}`,
          }
        );

        setAcceptDrop(false);
      }}
    >
      <div className="p-2">
        <EditableText
          fieldName="name"
          value={name}
          inputLabel="Edit column name"
          buttonLabel={`Edit column "${name}" name`}
          inputClassName="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
          buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
        >
          <input type="hidden" name="intent" value={INTENTS.updateColumn} />
          <input type="hidden" name="columnId" value={columnId} />
        </EditableText>
      </div>

      <ul ref={listRef} className="flex-grow overflow-auto min-h-[2px]">
        {items
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((item, index, items) => (
            <Card
              key={item.id}
              title={item.title}
              // content={item.content}
              id={item.id}
              order={item.order ?? 0}
              columnId={columnId}
              previousOrder={
                items[index - 1] ? (items[index - 1].order ?? 0) : 0
              }
              nextOrder={
                items[index + 1]
                  ? (items[index + 1].order ?? 0)
                  : (item.order ?? 0) + 1
              }
            />
          ))}
      </ul>
      {edit ? (
        <NewCard
          columnId={columnId}
          nextOrder={
            items.length === 0 ? 1 : (items[items.length - 1].order ?? 0) + 1
          }
          onAddCard={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      ) : (
        <div className="p-2 pt-1">
          <Button
            type="button"
            onClick={() => {
              flushSync(() => {
                setEdit(true);
              });
              scrollList();
            }}
            className="text-left w-full"
            // className="flex items-center gap-2 rounded-lg text-left w-full p-2 font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200"
          >
            <Plus /> Add a card
          </Button>
        </div>
      )}
    </div>
  );
}
