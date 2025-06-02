"use client";

import { useLocation } from "react-router";

export function LogoutRedirectLocation() {
  const location = useLocation();
  return (
    <input
      type="hidden"
      name="redirect"
      value={location.pathname + location.search}
    />
  );
}
