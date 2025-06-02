"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "react-router/rsc";
import { safeRedirect } from "remix-utils/safe-redirect";
import * as v from "valibot";

import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { afterLoginRedirect, afterLogoutRedirect } from "@/global-config";
import { setUserId } from "@/middleware/auth";

export const LogoutSchema = v.object({
  redirect: v.optional(v.string()),
});

export async function logoutAction(formData: FormData) {
  setUserId(undefined);
  const parsed = v.safeParse(LogoutSchema, Object.fromEntries(formData));
  throw redirect(
    safeRedirect(
      parsed.success ? parsed.output.redirect : undefined,
      afterLogoutRedirect
    )
  );
}

export const LoginWithCredentialsActionSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email is badly formatted."),
    v.maxLength(255, "Your email is too long.")
  ),
  password: v.string(),
  redirect: v.optional(v.string()),
});

export async function loginWithCredentialsAction(
  _: v.FlatErrors<typeof LoginWithCredentialsActionSchema> | undefined,
  formData: FormData
): Promise<v.FlatErrors<typeof LoginWithCredentialsActionSchema> | undefined> {
  const parsed = v.safeParse(
    LoginWithCredentialsActionSchema,
    Object.fromEntries(formData)
  );
  if (!parsed.success) {
    return v.flatten<typeof LoginWithCredentialsActionSchema>(parsed.issues);
  }

  const db = getDb();

  const dbUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, parsed.output.email),
    columns: {
      id: true,
      passwordHash: true,
    },
  });

  if (!dbUser) {
    return {
      root: ["The email or password is incorrect."],
    };
  }

  if (!(await compare(parsed.output.password, dbUser.passwordHash))) {
    return {
      root: ["The email or password is incorrect."],
    };
  }

  setUserId(dbUser.id);

  throw redirect(safeRedirect(parsed.output.redirect, afterLoginRedirect));
}

export const SignupWithCredentialsActionSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string(),
      v.nonEmpty("Please enter your email."),
      v.email("The email is badly formatted."),
      v.maxLength(255, "Your email is too long.")
    ),
    password: v.pipe(
      v.string(),
      v.nonEmpty("Please enter your password."),
      v.minLength(8, "Your password must be at least 8 characters long.")
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty("Please confirm your password.")
    ),
    redirect: v.optional(v.string()),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords do not match."
    ),
    ["confirmPassword"]
  )
);

export async function signupWithCredentialsAction(
  _: v.FlatErrors<typeof SignupWithCredentialsActionSchema> | undefined,
  formData: FormData
): Promise<v.FlatErrors<typeof SignupWithCredentialsActionSchema> | undefined> {
  const parsed = v.safeParse(
    SignupWithCredentialsActionSchema,
    Object.fromEntries(formData)
  );
  if (!parsed.success) {
    return v.flatten<typeof SignupWithCredentialsActionSchema>(parsed.issues);
  }

  const db = getDb();

  const dbUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, parsed.output.email),
  });

  if (dbUser) {
    return {
      root: ["An account with this email already exists."],
    };
  }

  const passwordHash = await hash(parsed.output.password, 12);

  const [createdUser] = await db
    .insert(schema.user)
    .values({
      email: parsed.output.email,
      passwordHash,
    })
    .returning({ id: schema.user.id });

  if (!createdUser) {
    return {
      root: ["Failed to create an account. Please try again."],
    };
  }

  setUserId(createdUser.id);

  throw redirect(safeRedirect(parsed.output.redirect, afterLoginRedirect));
}
