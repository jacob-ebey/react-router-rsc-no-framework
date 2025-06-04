"use client";

// @ts-expect-error - no types
import GalleryVerticalEnd from "lucide-react/dist/esm/icons/gallery-vertical-end.js";
import { useActionState } from "react";
import { Link, useSearchParams } from "react-router";

import { signupWithCredentialsAction } from "@/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { afterLoginRedirect, appName, loginPath } from "@/global-config";
import { cn } from "@/lib/utils";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div"> & {}) {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || afterLoginRedirect;

  const [signup, action, pending] = useActionState(
    signupWithCredentialsAction,
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
              <span className="sr-only">{appName}.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to {appName}.</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to={{
                  pathname: loginPath,
                  search: new URLSearchParams({ redirect }).toString(),
                }}
                className="underline underline-offset-4"
              >
                Login
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
                autoComplete="email"
                required
                defaultValue={signup?.state?.email}
              />
              {signup?.errors?.nested?.email && (
                <div className="text-destructive">
                  {signup.errors.nested.email}
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
                autoComplete="new-password"
                required
              />
              {signup?.errors?.nested?.password && (
                <div className="text-destructive">
                  {signup.errors.nested.password}
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="**********"
                autoComplete="new-password"
                required
              />
              {signup?.errors?.nested?.confirmPassword && (
                <div className="text-destructive">
                  {signup.errors.nested.confirmPassword}
                </div>
              )}
              {signup?.errors?.root && (
                <div className="text-destructive">{signup.errors.root}</div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
