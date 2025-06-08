import { Link } from "react-router";

import { logoutAction } from "@/auth/actions";
import { getUserId } from "@/auth/middleware";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  appName,
  chatHome,
  docsHome,
  ecommHome,
  loginPath,
  trellixHome,
} from "@/global-config";

export default function Landing() {
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
      title: "Ecommerce",
      description: "An example of an ecommerce site using React Router.",
      href: ecommHome,
    },
    {
      title: "Docs Site",
      description: "An example of a documentation site using React Router.",
      href: docsHome,
    },
    {
      title: "AI Chat",
      description: "An example of an AI chat app.",
      href: chatHome,
    },
    {
      title: "Trellix",
      description: "A Trello-like application built with React Router.",
      href: trellixHome,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <title>{appName}</title>

      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">React Router Kitchen Sink</h1>
        <p className="text-lg text-muted-foreground mb-2">
          A collection of React Router examples and patterns
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
    </div>
  );
}
