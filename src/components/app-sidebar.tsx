// @ts-expect-error - no types
import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end.js";
import * as React from "react";
import { Link } from "react-router";
import { version } from "react-router/package.json";

import { getUserId } from "@/auth/middleware";
import { getUserById } from "@/auth/user";
import { NavLogin } from "@/components/nav-login";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { appName } from "@/global-config";

export async function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const userId = getUserId();
  const user = userId ? await getUserById(userId) : null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{appName}</span>
                  <span className="">
                    {version.startsWith("0.0.0-")
                      ? version.replace(/^0\.0\.0\-/, "")
                      : `v${version}`}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <React.Suspense>{children}</React.Suspense>
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : <NavLogin />}
      </SidebarFooter>
    </Sidebar>
  );
}
