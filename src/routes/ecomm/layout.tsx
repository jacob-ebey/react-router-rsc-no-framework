import { Outlet } from "react-router";

import { RouteErrorBoundary } from "@/components/error-boundary";

import { Header } from "./components/header";

export default function EcommLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
