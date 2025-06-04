import { Outlet, ScrollRestoration } from "react-router";

import { authMiddleware } from "@/auth/middleware";
import { DelegateLinks } from "@/components/delegate-links";
import { RouteErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/sonner";

import "./styles.css";
import { GlobalLoadingIndicator } from "./root.client";

export const unstable_middleware = [authMiddleware];

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex flex-col h-svh">
        {children}
        <GlobalLoadingIndicator />
        <Toaster />
        <DelegateLinks />
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
