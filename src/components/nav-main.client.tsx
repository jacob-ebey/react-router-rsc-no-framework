"use client";

import {
  SidebarMenuButton,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router";

export function IsActiveSidebarMenuButton(
  props: Omit<React.ComponentProps<typeof SidebarMenuButton>, "isActive"> & {
    pathname: string;
  }
) {
  const location = useLocation();
  const isActive = location.pathname === props.pathname;

  return <SidebarMenuButton {...props} isActive={isActive} />;
}

export function IsActiveSidebarMenuSubButton(
  props: Omit<React.ComponentProps<typeof SidebarMenuSubButton>, "isActive"> & {
    pathname: string;
  }
) {
  const location = useLocation();
  const isActive = location.pathname === props.pathname;

  return <SidebarMenuSubButton {...props} isActive={isActive} />;
}
