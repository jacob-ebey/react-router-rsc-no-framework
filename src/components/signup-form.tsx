"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useActionState } from "react";
import { Link, useSearchParams } from "react-router";
import type * as v from "valibot";

import { type SignupWithCredentialsActionSchema } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { afterLoginRedirect, loginPath } from "@/global-config";
import { cn } from "@/lib/utils";

export function SignupForm({
  className,
  signupWithCredentialsAction,
  ...props
}: React.ComponentProps<"div"> & {
  signupWithCredentialsAction: (
    previousState:
      | v.FlatErrors<typeof SignupWithCredentialsActionSchema>
      | undefined,
    formData: FormData
  ) => Promise<
    v.FlatErrors<typeof SignupWithCredentialsActionSchema> | undefined
  >;
}) {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || afterLoginRedirect;

  const [state, action, pending] = useActionState(
    signupWithCredentialsAction,
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
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="**********"
                required
              />
              {state?.nested?.confirmPassword && (
                <div className="text-destructive">
                  {state.nested.confirmPassword}
                </div>
              )}
              {state?.root && (
                <div className="text-destructive">{state.root}</div>
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
