import { cache } from "react";
import { env } from "std-env";

import { gql } from "@/__generated__/gql";

import { fetchGraphQL } from "@/lib/graphql";

export const getCartData = cache(async (cartId: string) => {
  const url = env.SHOPIFY_API;
  if (!url) {
    throw new Error("SHOPIFY_API environment variable is not set");
  }

  const token = env.SHOPIFY_API_TOKEN;

  return await fetchGraphQL(
    url,
    CART_QUERY,
    { cartId },
    {
      headers: token
        ? {
            "Shopify-Storefront-Private-Token": token,
          }
        : undefined,
    }
  );
});

const CART_QUERY = gql(`
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 10) {
        nodes {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`);
