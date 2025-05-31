import { signupWithCredentialsAction } from "@/actions/auth";
import { SignupForm } from "@/components/signup-form";
import { afterLoginRedirect, appName } from "@/global-config";
import { redirectIfAuthenticatedMiddleware } from "@/middleware/auth";

export const unstable_middleware = [
  redirectIfAuthenticatedMiddleware(afterLoginRedirect),
];

export default function Signup() {
  return (
    <>
      <title>{`Signup | ${appName}`}</title>

      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm
            signupWithCredentialsAction={signupWithCredentialsAction}
          />
        </div>
      </div>
    </>
  );
}
