import { Outlet } from "react-router";

import { RouteErrorBoundary } from "@/components/error-boundary";

import { Header } from "./components/header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default function EcommLayout() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <div className="container mx-auto">
      <RouteErrorBoundary />
    </div>
  );
}
