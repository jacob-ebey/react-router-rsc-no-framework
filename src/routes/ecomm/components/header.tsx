// @ts-expect-error
import Login from "lucide-react/dist/esm/icons/log-in.js";
// @ts-expect-error
import Logout from "lucide-react/dist/esm/icons/log-out.js";
import { Link } from "react-router";
import { env } from "std-env";

import { gql } from "@/__generated__/gql";
import { logoutAction } from "@/auth/actions";
import { getUserId } from "@/auth/middleware";
import { RedirectToSelf } from "@/components/redirect-to-self";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ecommHome, loginPath, signupPath } from "@/global-config";
import { fetchGraphQL } from "@/lib/graphql";

import { LinkWithRedirect } from "./header.client";

export async function Header() {
  const userId = getUserId();

  const { collections, shop } = await getHeaderData();

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <nav className="flex gap-4 container mx-auto p-4">
        <div className="flex items-center gap-4">
          <Link to={ecommHome} className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tighter text-nowrap">
              {shop.name}
            </span>
          </Link>
        </div>
        <div className="flex items-center ml-auto md:flex-1 md:ml-0 gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className=" hidden md:flex">
                  Collections
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[400px] md:w-[500px] lg:w-[600px] hidden md:flex">
                  <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {collections.nodes.map((collection) => (
                      <li key={collection.id}>
                        <NavigationMenuLink
                          className="h-full"
                          href={`${ecommHome}/collections/${collection.handle}`}
                        >
                          <div className="text-sm leading-none font-medium">
                            {collection.title}
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            {collection.description}
                          </p>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <NavigationMenuLink
                      className="h-full"
                      href={`${ecommHome}/collections`}
                    >
                      <div className="text-sm leading-none font-medium">
                        All Collections
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        Browse all collections available in our store.
                      </p>
                    </NavigationMenuLink>
                  </ul>
                </NavigationMenuContent>
                <NavigationMenuLink
                  className="md:hidden"
                  href={`${ecommHome}/collections`}
                >
                  Collections
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={`${ecommHome}/products`}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
                >
                  Products
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {userId ? (
            <form
              className="flex items-center gap-2 ml-auto"
              action={logoutAction}
            >
              <RedirectToSelf />
              <Button type="submit" variant="outline" size="sm">
                <Logout className="sm:hidden" />
                <span className="sr-only sm:not-sr-only">Logout</span>
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2 ml-auto">
              <Button asChild variant="outline" size="sm">
                <LinkWithRedirect to={loginPath}>
                  <Login className="sm:hidden" />
                  <span className="sr-only sm:not-sr-only">Login</span>
                </LinkWithRedirect>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <LinkWithRedirect to={signupPath}>Signup</LinkWithRedirect>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

async function getHeaderData() {
  "use cache";

  const url = env.SHOPIFY_API;
  if (!url) {
    throw new Error("SHOPIFY_API environment variable is not set");
  }

  const token = env.SHOPIFY_API_TOKEN;

  return await fetchGraphQL(url, HEADER_QUERY, undefined, {
    headers: token
      ? {
          "Shopify-Storefront-Private-Token": token,
        }
      : undefined,
  });
}

// const gql = String.raw;
const HEADER_QUERY = gql(`
  query Header {
    shop {
      name
    }
    collections(first: 3) {
      nodes {
        id
        handle
        title
        description
      }
    }
  }
`);
