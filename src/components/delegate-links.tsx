"use client";

import { useDelegatedAnchors } from "@/hooks/use-delegated-anchors";

export function DelegateLinks() {
  useDelegatedAnchors({
    current: typeof document !== "undefined" ? document.body : null,
  });
  return <></>;
}
