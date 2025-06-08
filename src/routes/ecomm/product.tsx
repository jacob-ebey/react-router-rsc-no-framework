import assert from "assert";
import type { LoaderFunctionArgs } from "react-router";
import { env } from "std-env";
// @ts-expect-error
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart.js";

import { gql } from "@/__generated__/gql";
import { fetchGraphQL } from "@/lib/graphql";
import { Button } from "@/components/ui/button";
import { CopyPermalinkButton, ProductOptions } from "./product.client";

export async function loader({ params, request }: LoaderFunctionArgs) {
  assert(params.handle, "Product handle is required");

  const { product } = await getProductMeta(params.handle);

  if (!product) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const url = new URL(request.url);

  const selectedOptions: Record<string, string> = {};
  for (const option of product.options) {
    const value = url.searchParams.get(option.name);
    if (value && option.optionValues.some((v) => v.name === value)) {
      selectedOptions[option.name] = value;
    }
  }

  return {
    selectedOptions,
  };
}

export default async function EcommProduct({
  loaderData: { selectedOptions },
  params,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
  params: { handle: string };
}) {
  const { product } = await getProduct(
    params.handle,
    Object.entries(selectedOptions).map(([name, value]) => ({ name, value }))
  );
  assert(product, "Product not found");

  const featuredImage =
    product.variantBySelectedOptions?.image ??
    product.featuredImage ??
    product.images.nodes[0];

  const minPrice =
    product.variantBySelectedOptions?.price ??
    product.priceRange.minVariantPrice;
  const maxPrice = product.variantBySelectedOptions
    ? null
    : product.priceRange.minVariantPrice.amount !==
        product.priceRange.maxVariantPrice.amount
      ? product.priceRange.maxVariantPrice
      : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={featuredImage.url}
              alt={featuredImage.altText || ""}
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          {/* <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? "border-primary" : "border-muted"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product thumbnail ${index + 1}`}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div> */}
        </div>

        {/* Product Info */}
        <form className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="text-2xl font-bold mt-2">
              <span>{minPrice.amount}</span>
              {!maxPrice ? (
                <>
                  &nbsp;
                  <span className="text-sm">{minPrice.currencyCode}</span>
                </>
              ) : null}
              {maxPrice && (
                <>
                  {" - "}
                  <span>{maxPrice.amount}</span>
                  &nbsp;
                  <span className="text-sm">{maxPrice.currencyCode}</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground mt-4">{product.description}</p>
          </div>

          <ProductOptions
            key={product.variantBySelectedOptions?.id}
            defaultSelectedOptions={selectedOptions}
            options={product.options}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              size="lg"
              disabled={!product.variantBySelectedOptions}
            >
              <ShoppingCart className="mr-2" />
              Add to Cart
            </Button>
            <CopyPermalinkButton disabled={!product.variantBySelectedOptions} />
          </div>

          <div className="flex space-x-2"></div>

          <div className="grid grid-cols-3 gap-4 pt-4"></div>
        </form>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12"></div>
    </div>
  );
}

const PRODUCT_META_QUERY = gql(`
  query ProductExists($handle: String!) {
    product(handle: $handle) {
      id
      options {
        id
        name
        optionValues {
          id
          name
        }
      }
    }
  }
`);

async function getProductMeta(handle: string) {
  "use cache";

  const url = env.SHOPIFY_API;
  if (!url) {
    throw new Error("SHOPIFY_API environment variable is not set");
  }

  const token = env.SHOPIFY_API_TOKEN;

  return await fetchGraphQL(
    url,
    PRODUCT_META_QUERY,
    { handle },
    {
      headers: token
        ? {
            "Shopify-Storefront-Private-Token": token,
          }
        : undefined,
    }
  );
}

const PRODUCT_QUERY = gql(`
  query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      featuredImage {
        id
        altText
        url
      }
      images(first: 10) {
        nodes {
          id
          altText
          url
        }
      }
      variantBySelectedOptions(caseInsensitiveMatch: true, ignoreUnknownOptions: true, selectedOptions: $selectedOptions) {
        id
        price {
          amount
          currencyCode
        }
        image {
          id
          altText
          url
        }
      }
      options {
        id
        name
        optionValues {
          id
          name
        }
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
`);

async function getProduct(
  handle: string,
  selectedOptions: { name: string; value: string }[]
) {
  "use cache";

  const url = env.SHOPIFY_API;
  if (!url) {
    throw new Error("SHOPIFY_API environment variable is not set");
  }

  const token = env.SHOPIFY_API_TOKEN;

  return await fetchGraphQL(
    url,
    PRODUCT_QUERY,
    { handle, selectedOptions },
    {
      headers: token
        ? {
            "Shopify-Storefront-Private-Token": token,
          }
        : undefined,
    }
  );
}
