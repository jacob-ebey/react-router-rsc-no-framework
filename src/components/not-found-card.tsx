import { ArrowLeft, Home } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function NotFoundCard() {
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader className="space-y-4">
        <div className="text-6xl font-bold text-gray-900">404</div>
        <CardTitle className="text-2xl">Page Not Found</CardTitle>
        <CardDescription className="text-gray-600">
          Sorry, we couldn't find the page you're looking for. The page might
          have been moved, deleted, or you may have entered the wrong URL.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
