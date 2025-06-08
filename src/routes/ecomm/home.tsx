import { gql } from "@/__generated__/gql";
import { Button } from "@/components/ui/button";
import { ecommFeaturedCollection, ecommHome } from "@/global-config";
import { fetchGraphQL } from "@/lib/graphql";
import { Link } from "react-router";
import { env } from "std-env";

import { ProductCard } from "./components/product-card";

export default async function EcommHome() {
  const { featuredCollection } = await getHomeData();

  return (
    <div>
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {featuredCollection?.title}
              </h1>
              <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {featuredCollection?.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link
                    to={`${ecommHome}/collections/${ecommFeaturedCollection}`}
                  >
                    Featured Collection
                  </Link>
                </Button>
                <Button asChild>
                  <Link to={`${ecommHome}/collections`}>All Collections</Link>
                </Button>
              </div>
            </div>

            <img
              loading="eager"
              src={featuredCollection?.image?.url}
              alt={featuredCollection?.image?.altText || ""}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full aspect-video"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredCollection?.products.nodes.map(
              ({
                description,
                featuredImage,
                handle,
                id,
                priceRange,
                title,
              }) => (
                <ProductCard
                  key={id}
                  description={description}
                  featuredImage={featuredImage}
                  handle={handle}
                  id={id}
                  priceRange={priceRange}
                  title={title}
                />
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const HOME_QUERY = gql(`
  query HomePage($featuredCollectionHandle: String) {
    featuredCollection: collection(handle: $featuredCollectionHandle) {
      id
      title
      description
      image {
        altText
        url
      }
      products(first: 20) {
        nodes {
          id
          handle
          title
          description
          featuredImage {
            altText
            url
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`);

async function getHomeData() {
  "use cache";

  const url = env.SHOPIFY_API;
  if (!url) {
    throw new Error("SHOPIFY_API environment variable is not set");
  }

  const token = env.SHOPIFY_API_TOKEN;

  return await fetchGraphQL(
    url,
    HOME_QUERY,
    {
      featuredCollectionHandle: ecommFeaturedCollection,
    },
    {
      headers: token
        ? {
            "Shopify-Storefront-Private-Token": token,
          }
        : undefined,
    }
  );
}
