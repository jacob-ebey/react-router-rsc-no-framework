import { AsyncLocalStorage } from "node:async_hooks";

import type { Session, unstable_MiddlewareFunction } from "react-router/rsc";
import { createCookieSessionStorage, redirect } from "react-router/rsc";
import { env } from "std-env";

import { loginPath } from "@/global-config";

export type AuthSessionData = {
  userId?: string;
};

export type AuthContext = {
  session: Session<AuthSessionData>;
};

declare global {
  var AuthStorage: AsyncLocalStorage<AuthContext>;
}

export const AuthStorage = (globalThis.AuthStorage ??=
  new AsyncLocalStorage<AuthContext>());

export const authMiddleware: unstable_MiddlewareFunction = async (
  { request },
  next
) => {
  if (AuthStorage.getStore()) {
    return next();
  }

  const SESSION_SECRET = env.SESSION_SECRET;
  if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not set in the environment variables.");
  }

  const sessionStorage = createCookieSessionStorage<AuthSessionData>({
    cookie: {
      name: "auth",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [SESSION_SECRET],
    },
  });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const response = await AuthStorage.run({ session }, next);

  if (response instanceof Response) {
    response.headers.append(
      "Set-Cookie",
      await sessionStorage.commitSession(session)
    );
  }

  return response;
};

export function getUserId() {
  const store = AuthStorage.getStore();
  if (!store) {
    // TODO: This should be throwing an error, but since Layout is rendered
    // in the manifest request right now, middleware isn't ran to wrap
    // in AuthStore.run(...). I don't think that's optimal and we should
    // figure out a way to resolve this.
    return undefined;
  }
  return store.session.get("userId");
}

export function setUserId(userId: string | undefined) {
  const store = AuthStorage.getStore();
  if (!store) {
    throw new Error(
      "Auth context is not available. Ensure middleware is applied."
    );
  }
  if (!userId) {
    store.session.unset("userId");
  } else {
    store.session.set("userId", userId);
  }
}

export const requireAuthMiddleware: unstable_MiddlewareFunction = async (
  { request },
  next
) => {
  const userId = getUserId();
  if (!userId) {
    const url = new URL(request.url);
    throw redirect(
      `${loginPath}?${new URLSearchParams({ redirect: url.pathname + url.search })}`
    );
  }
  return next();
};

export const redirectIfAuthenticatedMiddleware =
  (
    to: string | ((args: { request: Request }) => string)
  ): unstable_MiddlewareFunction =>
  async ({ request }, next) => {
    const userId = getUserId();
    if (userId) {
      const redirectUrl = typeof to === "function" ? to({ request }) : to;
      throw redirect(redirectUrl);
    }
    return next();
  };
