import { cache } from "react";

import { getDb } from "@/db/client";

export const getUserById = cache((userId: string) => {
  const db = getDb();

  return db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    columns: {
      id: true,
      email: true,
    },
  });
});
