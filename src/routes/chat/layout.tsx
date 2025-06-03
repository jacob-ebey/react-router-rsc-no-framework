import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireAuthMiddleware } from "@/middleware/auth";

import { ChatNav } from "./components/nav";

export const unstable_middleware = [requireAuthMiddleware];

export default async function Chat() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar>
          <ChatNav />
        </AppSidebar>
        <SidebarInset className="flex-1 flex flex-col min-h-0">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:hidden sticky top-0 bg-background border-b border-border z-20">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 md:hidden" />
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
