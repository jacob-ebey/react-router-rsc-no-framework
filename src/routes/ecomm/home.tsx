import { gql } from "@/__generated__/gql";
import { Button } from "@/components/ui/button";
import { ecommFeaturedCollection, ecommHome } from "@/global-config";
import { fetchGraphQL } from "@/lib/graphql";
import { Link } from "react-router";
import { env } from "std-env";

export default async function EcommHome() {
  const { featuredCollection } = await getHomeData();
  console.log(featuredCollection);

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
            <div className="mx-auto lg:mx-0">
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
        </div>
      </section>
      <section className="py-12 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredCollection?.products.nodes.map((product) => (
              <div
                key={product.id}
                className="flex flex-col bg-background rounded-lg shadow-sm border p-4"
              >
                <Link
                  to={`${ecommHome}/product/${product.handle}`}
                  className="block mb-4"
                >
                  <img
                    loading="lazy"
                    src={product.featuredImage?.url}
                    alt={product.featuredImage?.altText || ""}
                    className="rounded-md object-cover w-full aspect-video"
                  />
                </Link>
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-sm mb-3">{product.description}</p>
                <div className="flex-1" />
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    {product.priceRange.minVariantPrice.amount}
                    <span className="text-sm">
                      {product.priceRange.minVariantPrice.currencyCode}
                    </span>
                  </span>
                  <Button type="button">Add to Cart</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

async function getHomeData(userId?: string) {
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

const HOME_QUERY = gql(`
  query HomePageQuery($featuredCollectionHandle: String) {
    featuredCollection: collection(handle: $featuredCollectionHandle) {
      id
      title
      description
      image {
        altText
        url
      }
      products(first: 9) {
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
          }
        }
      }
    }
  }
`);
