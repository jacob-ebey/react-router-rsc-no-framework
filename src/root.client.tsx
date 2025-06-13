"use client";

import { useNavigation } from "react-router";

import { Progress } from "@/components/ui/progress";

export function GlobalLoadingIndicator() {
  const navigation = useNavigation();

  if (navigation.state === "idle") return;

  return (
    <Progress
      indeterminate
      className="rounded-none h-1 opacity-50 fixed top-0 z-50"
    />
  );
}
