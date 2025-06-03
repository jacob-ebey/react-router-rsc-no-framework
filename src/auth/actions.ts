"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "react-router/rsc";
import { safeRedirect } from "remix-utils/safe-redirect";
import * as v from "valibot";

import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { afterLoginRedirect, afterLogoutRedirect } from "@/global-config";

import { setUserId } from "./middleware";

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
    v.string("Email is required."),
    v.nonEmpty("Please enter your email."),
    v.email("The email is badly formatted."),
    v.maxLength(255, "Your email is too long.")
  ),
  password: v.pipe(
    v.string("Password is required."),
    v.nonEmpty("Please enter your password.")
  ),
  redirect: v.optional(v.string()),
});

export type LoginWithCredentialsState = {
  state?: { email?: string };
  errors: v.FlatErrors<typeof LoginWithCredentialsActionSchema> | undefined;
};

export async function loginWithCredentialsAction(
  _: LoginWithCredentialsState | undefined,
  formData: FormData
): Promise<LoginWithCredentialsState | undefined> {
  const parsed = v.safeParse(
    LoginWithCredentialsActionSchema,
    Object.fromEntries(formData)
  );
  if (!parsed.success) {
    const email =
      parsed.output &&
      typeof parsed.output === "object" &&
      "email" in parsed.output &&
      typeof parsed.output.email === "string"
        ? parsed.output.email
        : undefined;
    return {
      errors: v.flatten<typeof LoginWithCredentialsActionSchema>(parsed.issues),
      state: { email },
    };
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
      errors: {
        root: ["The email or password is incorrect."],
      },
      state: { email: parsed.output.email },
    };
  }

  if (!(await compare(parsed.output.password, dbUser.passwordHash))) {
    return {
      errors: {
        root: ["The email or password is incorrect."],
      },
      state: { email: parsed.output.email },
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

export type SignupWithCredentialsState = {
  state?: { email?: string };
  errors: v.FlatErrors<typeof SignupWithCredentialsActionSchema> | undefined;
};

export async function signupWithCredentialsAction(
  _: SignupWithCredentialsState | undefined,
  formData: FormData
): Promise<SignupWithCredentialsState | undefined> {
  const parsed = v.safeParse(
    SignupWithCredentialsActionSchema,
    Object.fromEntries(formData)
  );
  if (!parsed.success) {
    const email =
      parsed.output &&
      typeof parsed.output === "object" &&
      "email" in parsed.output &&
      typeof parsed.output.email === "string"
        ? parsed.output.email
        : undefined;
    return {
      errors: v.flatten<typeof SignupWithCredentialsActionSchema>(
        parsed.issues
      ),
      state: {
        email,
      },
    };
  }

  const db = getDb();

  const dbUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, parsed.output.email),
  });

  if (dbUser) {
    return {
      errors: {
        root: ["An account with this email already exists."],
      },
      state: {
        email: parsed.output.email,
      },
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
      errors: {
        root: ["Failed to create an account. Please try again."],
      },
      state: {
        email: parsed.output.email,
      },
    };
  }

  setUserId(createdUser.id);

  throw redirect(safeRedirect(parsed.output.redirect, afterLoginRedirect));
}
