// @ts-expect-error - no types
import LogIn from "lucide-react/dist/esm/icons/log-in.js";

import { LoginForm } from "@/components/login-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavLogin() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton>
              <LogIn />
              Login
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="sr-only">Login</DialogTitle>
            </DialogHeader>
            <LoginForm redirectToCurrentLocation />
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
