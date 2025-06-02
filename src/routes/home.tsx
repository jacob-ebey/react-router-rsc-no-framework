import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { docsHome, loginPath } from "@/global-config";
import { getUserId } from "@/middleware/auth";
import { Link } from "react-router";

export default function Home() {
  const userId = getUserId();

  const examples = [
    {
      title: "Authentication Flow",
      description: "A complete authentication flow with login, and signup.",
      href: loginPath,
      hrefText: "Go to Login",
      authenticatedAction: logoutAction,
      authenticatedActionText: "Logout",
    },
    {
      title: "Docs Site",
      description: "An example of a documentation site using React Router.",
      href: docsHome,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">React Router Kitchen Sink</h1>
        <p className="text-lg text-muted-foreground mb-2">
          A comprehensive collection of React Router examples and patterns
        </p>
        <p className="text-sm text-muted-foreground">
          Explore different routing concepts and implementation patterns
        </p>
      </header>

      <Separator className="mb-8" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Examples</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {examples.map((example) => (
            <Card key={example.href} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {!!userId && !!example.authenticatedAction ? (
                  <form action={example.authenticatedAction}>
                    <Button type="submit" variant="outline" className="w-full">
                      {example.authenticatedActionText}
                    </Button>
                  </form>
                ) : (
                  <Button variant="outline" asChild className="w-full">
                    <Link to={example.href}>
                      {example.hrefText || "View Example"}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm text-muted-foreground">
        <Separator className="mb-8" />
        <p>React Router Kitchen Sink Demo</p>
      </footer>
    </div>
  );
}
