import { LoginForm } from "@/components/login-form";
import { afterLoginRedirect, appName } from "@/global-config";
import { redirectIfAuthenticatedMiddleware } from "@/middleware/auth";

export const unstable_middleware = [
  redirectIfAuthenticatedMiddleware(afterLoginRedirect),
];

export default function Login() {
  return (
    <>
      <title>{`Login | ${appName}`}</title>

      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
