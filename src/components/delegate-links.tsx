"use client";

import { useDelegatedAnchors } from "remix-utils/use-delegated-anchors";

export function DelegateLinks() {
  useDelegatedAnchors({
    current: typeof document !== "undefined" ? document.body : null,
  });
  return <></>;
}
