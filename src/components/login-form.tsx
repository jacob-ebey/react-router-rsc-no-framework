"use client";

// @ts-expect-error - no types
import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end.js";
import { useActionState } from "react";
import { Link, useLocation, useSearchParams } from "react-router";

import { loginWithCredentialsAction } from "@/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { afterLoginRedirect, signupPath } from "@/global-config";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  redirectToCurrentLocation,
  ...props
}: React.ComponentProps<"div"> & {
  redirectToCurrentLocation?: boolean;
}) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const redirect = redirectToCurrentLocation
    ? location.pathname + location.search
    : searchParams.get("redirect") || afterLoginRedirect;

  const [login, action, pending] = useActionState(
    loginWithCredentialsAction,
    undefined
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={action}>
        {!!redirect && <input type="hidden" name="redirect" value={redirect} />}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to={{
                  pathname: signupPath,
                  search: new URLSearchParams({ redirect }).toString(),
                }}
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue={login?.state?.email}
              />
              {login?.errors?.nested?.email && (
                <div className="text-destructive">
                  {login.errors.nested.email}
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="**********"
                required
              />
              {login?.errors?.nested?.password && (
                <div className="text-destructive">
                  {login.errors.nested.password}
                </div>
              )}
              {login?.errors?.root && (
                <div className="text-destructive">{login.errors.root}</div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Logging in..." : "Login"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
