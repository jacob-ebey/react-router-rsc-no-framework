"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useActionState } from "react";
import { Link, useSearchParams } from "react-router";
import type * as v from "valibot";

import { type LoginWithCredentialsActionSchema } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { afterLoginRedirect, signupPath } from "@/global-config";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  loginWithCredentialsAction,
  ...props
}: React.ComponentProps<"div"> & {
  loginWithCredentialsAction: (
    previousState:
      | v.FlatErrors<typeof LoginWithCredentialsActionSchema>
      | undefined,
    formData: FormData
  ) => Promise<
    v.FlatErrors<typeof LoginWithCredentialsActionSchema> | undefined
  >;
}) {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || afterLoginRedirect;

  const [state, action, pending] = useActionState(
    loginWithCredentialsAction,
    undefined
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={action}>
        {!!redirect && <input type="hidden" name="redirect" value={redirect} />}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
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
              />
              {state?.nested?.email && (
                <div className="text-destructive">{state.nested.email}</div>
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
              {state?.nested?.password && (
                <div className="text-destructive">{state.nested.password}</div>
              )}
              {state?.root && (
                <div className="text-destructive">{state.root}</div>
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
