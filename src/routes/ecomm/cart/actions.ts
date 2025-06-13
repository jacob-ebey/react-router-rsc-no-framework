"use server";

import { env } from "std-env";
import * as v from "valibot";

import { gql } from "@/__generated__/gql";
import { getUserId } from "@/auth/middleware";
import { fetchGraphQL } from "@/lib/graphql";
import { getCartId, setCartId } from "./middleware";

export const AddToCartSchema = v.object({
  _productId: v.string("Product ID is required."),
  _quantity: v.optional(v.number("Quantity must be a number.")),
});

export type AddToCartState = v.FlatErrors<typeof AddToCartSchema> | undefined;

export async function addToCartAction(
  formData: FormData
): Promise<AddToCartState | undefined> {
  const parsed = v.safeParse(AddToCartSchema, Object.fromEntries(formData));
  if (!parsed.success) {
    return v.flatten<typeof AddToCartSchema>(parsed.issues);
  }

  const { _productId: productId, _quantity: quantity } = parsed.output;

  const selectedOptions: { name: string; value: string }[] = [];
  for (const [name, value] of formData) {
    if (
      name === "_productId" ||
      name === "_quantity" ||
      typeof value !== "string" ||
      !value
    ) {
      continue;
    }
    selectedOptions.push({ name, value });
  }

  const url = env.SHOPIFY_API;
  if (!url) {
    throw new Error("SHOPIFY_API environment variable is not set");
  }

  const token = env.SHOPIFY_API_TOKEN;

  const selected = await fetchGraphQL(
    url,
    GET_VARIANT_QUERY,
    { productId, selectedOptions },
    {
      headers: token
        ? {
            "Shopify-Storefront-Private-Token": token,
          }
        : undefined,
    }
  );
  const selectedVariantId = selected.product?.variantBySelectedOptions?.id;

  if (!selectedVariantId) {
    return {
      root: ["Failed to find a matching product variant."],
    };
  }

  const cartId = getCartId();

  if (!cartId) {
    const created = await fetchGraphQL(
      url,
      CREATE_CART_MUTATION,
      {
        input: {
          lines: [
            {
              merchandiseId: selectedVariantId,
              quantity: quantity ?? 1,
            },
          ],
        },
      },
      {
        headers: token
          ? {
              "Shopify-Storefront-Private-Token": token,
            }
          : undefined,
      }
    );
    const cartId = created.cartCreate?.cart?.id;
    if (!cartId) {
      return {
        root: ["Failed to create a new cart."],
      };
    }
    setCartId(cartId);
  } else {
    const updated = await fetchGraphQL(
      url,
      ADD_TO_CART_MUTATION,
      {
        cartId,
        lines: [
          {
            merchandiseId: selectedVariantId,
            quantity: quantity ?? 1,
          },
        ],
      },
      {
        headers: token
          ? {
              "Shopify-Storefront-Private-Token": token,
            }
          : undefined,
      }
    );
    const updatedCartId = updated.cartLinesAdd?.cart?.id;
    if (!updatedCartId) {
      return {
        root: ["Failed to add item to the cart."],
      };
    }
  }
}

const GET_VARIANT_QUERY = gql(`
  query GetVariant($productId: ID!, $selectedOptions: [SelectedOptionInput!]!) {
    product(id: $productId) {
      variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
      }
    }
  }
`);

// TODO: Implement the actual GraphQL mutation to add to cart
const CREATE_CART_MUTATION = gql(`
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
      }
    }
  }
`);

const ADD_TO_CART_MUTATION = gql(`
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
    }
  }
`);
