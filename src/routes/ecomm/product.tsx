import assert from "assert";
import type { LoaderFunctionArgs } from "react-router";
import { env } from "std-env";
// @ts-expect-error
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart.js";

import { gql } from "@/__generated__/gql";
import { fetchGraphQL } from "@/lib/graphql";
import {
  AddToCartButton,
  AddToCartForm,
  CopyPermalinkButton,
  ProductOptions,
} from "./product.client";

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
  const [{ product }, { product: selectedProduct }] = await Promise.all([
    getProduct(params.handle),
    getSelectedProduct(
      params.handle,
      Object.entries(selectedOptions).map(([name, value]) => ({ name, value }))
    ),
  ]);
  assert(product, "Product not found");

  const featuredImage =
    selectedProduct?.variantBySelectedOptions?.image ??
    product.featuredImage ??
    product.images.nodes[0];

  const minPrice =
    selectedProduct?.variantBySelectedOptions?.price ??
    product.priceRange.minVariantPrice;
  const maxPrice = selectedProduct?.variantBySelectedOptions
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
              className="h-full w-full object-cover block"
              style={{
                viewTransitionName: featuredImage.id
                  ? `product_image_${btoa(featuredImage.id).replace(/=+$/g, "")}`
                  : undefined,
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <AddToCartForm>
          <input type="hidden" name="_productId" value={product.id} />
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
            key={selectedProduct?.variantBySelectedOptions?.id}
            defaultSelectedOptions={selectedOptions}
            options={product.options}
          />

          <div className="flex flex-wrap gap-2">
            <AddToCartButton
              type="submit"
              className="w-full sm:w-auto"
              size="lg"
              disabled={!selectedProduct?.variantBySelectedOptions}
            >
              <ShoppingCart className="mr-2" />
              Add to Cart
            </AddToCartButton>
            <CopyPermalinkButton />
          </div>

          <div className="flex space-x-2"></div>
        </AddToCartForm>
      </div>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {product.images.nodes.map((image) =>
          image.id === featuredImage?.id ? null : (
            <img
              key={image.id}
              src={image.url}
              alt={image.altText || ""}
              width={image.width ?? undefined}
              height={image.height ?? undefined}
              className="block"
              style={{
                viewTransitionName: image.id
                  ? `product_image_${btoa(image.id).replace(/=+$/g, "")}`
                  : undefined,
              }}
            />
          )
        )}
      </div>
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
  query Product($handle: String!) {
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
          width
          height
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

async function getProduct(handle: string) {
  "use cache";

  const url = env.SHOPIFY_API;
  if (!url) {
    throw new Error("SHOPIFY_API environment variable is not set");
  }

  const token = env.SHOPIFY_API_TOKEN;

  return await fetchGraphQL(
    url,
    PRODUCT_QUERY,
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

const SELECTED_PRODUCT_QUERY = gql(`
  query SelectedProduct(
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) {
    product(handle: $handle) {
      variantBySelectedOptions(
        caseInsensitiveMatch: true
        ignoreUnknownOptions: true
        selectedOptions: $selectedOptions
      ) {
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
    }
  }
`);

async function getSelectedProduct(
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
    SELECTED_PRODUCT_QUERY,
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
