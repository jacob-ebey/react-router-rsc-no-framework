import { getDb } from "@/db/client";
import * as schema from "@/db/schema";

import { ItemMutation } from "./types";
import { and, eq, inArray, sql } from "drizzle-orm";

async function canAccessBoard(boardId: string, accountId: string) {
  const db = getDb();

  const board = await db.query.board.findFirst({
    columns: { id: true },
    where: (board, { and, eq }) =>
      and(eq(board.id, boardId), eq(board.userId, accountId)),
  });

  return !!board;
}

export async function deleteCard(id: string, accountId: string) {
  const db = getDb();

  const boardsForAccount = db
    .select({ id: schema.board.id })
    .from(schema.board)
    .where(eq(schema.board.userId, accountId))
    .as("boardsForAccount");

  await db
    .delete(schema.boardCard)
    .where(
      and(
        eq(schema.boardCard.id, id),
        inArray(
          schema.boardCard.boardId,
          db.select({ id: boardsForAccount.id }).from(boardsForAccount)
        )
      )
    );
}

export async function getBoardData(boardId: string, accountId: string) {
  const db = getDb();

  return await db.query.board.findFirst({
    where: (board, { and, eq }) =>
      and(eq(board.id, boardId), eq(board.userId, accountId)),
    with: {
      cards: true,
      columns: {
        orderBy: (column) => column.order,
      },
    },
  });
}

export async function updateBoardName(
  boardId: string,
  name: string,
  accountId: string
) {
  const db = getDb();

  return await db
    .update(schema.board)
    .set({ name })
    .where(
      and(eq(schema.board.id, boardId), eq(schema.board.userId, accountId))
    );
}

export async function upsertItem(
  mutation: ItemMutation & { boardId: string },
  accountId: string
) {
  const db = getDb();

  if (!(await canAccessBoard(mutation.boardId, accountId))) {
    return;
  }

  await db
    .insert(schema.boardCard)
    .values({
      id: mutation.id,
      columnId: mutation.columnId,
      order: mutation.order,
      title: mutation.title,
      boardId: mutation.boardId,
    })
    .onConflictDoUpdate({
      target: schema.boardCard.id,
      set: {
        columnId: mutation.columnId,
        order: mutation.order,
        title: mutation.title,
      },
    });
}

export async function updateColumnName(
  id: string,
  name: string,
  accountId: string
) {
  const db = getDb();

  const boardsForAccount = db
    .select({ id: schema.board.id })
    .from(schema.board)
    .where(eq(schema.board.userId, accountId))
    .as("boardsForAccount");

  await db
    .update(schema.boardColumn)
    .set({ name })
    .where(
      and(
        eq(schema.boardColumn.id, id),
        inArray(
          schema.boardColumn.boardId,
          db.select({ id: boardsForAccount.id }).from(boardsForAccount)
        )
      )
    );
}

export async function createColumn(
  boardId: string,
  name: string,
  id: string,
  accountId: string
) {
  const db = getDb();

  if (!(await canAccessBoard(boardId, accountId))) {
    return;
  }

  const columnCount = await db.$count(
    db
      .select({ id: schema.boardColumn.id })
      .from(schema.boardColumn)
      .where(eq(schema.boardColumn.boardId, boardId))
  );

  try {
    await db.insert(schema.boardColumn).values({
      id,
      boardId,
      name,
      order: columnCount + 1,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteBoard(boardId: string, accountId: string) {
  const db = getDb();

  await db
    .delete(schema.board)
    .where(
      and(eq(schema.board.id, boardId), eq(schema.board.userId, accountId))
    );
}

export async function createBoard(userId: string, name: string, color: string) {
  const db = getDb();

  const [board] = await db
    .insert(schema.board)
    .values({
      name,
      color,
      userId,
    })
    .returning({ id: schema.board.id });

  return board;
}

export async function getHomeData(userId: string) {
  const db = getDb();

  return await db.query.board.findMany({
    where: (board, { eq }) => eq(board.userId, userId),
    orderBy: (board, { desc }) => desc(board.createdAt),
    columns: {
      id: true,
      name: true,
      color: true,
      createdAt: true,
    },
  });
}
