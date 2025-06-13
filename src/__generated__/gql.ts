/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetVariant($productId: ID!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(id: $productId) {\n      variantBySelectedOptions(selectedOptions: $selectedOptions) {\n        id\n      }\n    }\n  }\n": typeof types.GetVariantDocument,
    "\n  mutation CreateCart($input: CartInput!) {\n    cartCreate(input: $input) {\n      cart {\n        id\n      }\n    }\n  }\n": typeof types.CreateCartDocument,
    "\n  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {\n    cartLinesAdd(cartId: $cartId, lines: $lines) {\n      cart {\n        id\n      }\n    }\n  }\n": typeof types.AddToCartDocument,
    "\n  query Cart($cartId: ID!) {\n    cart(id: $cartId) {\n      id\n      totalQuantity\n      cost {\n        totalAmount {\n          amount\n          currencyCode\n        }\n      }\n      lines(first: 10) {\n        nodes {\n          id\n          quantity\n          merchandise {\n            ... on ProductVariant {\n              id\n              title\n              price {\n                amount\n                currencyCode\n              }\n              product {\n                id\n                title\n                handle\n                featuredImage {\n                  url\n                  altText\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.CartDocument,
    "\n  query Header {\n    shop {\n      name\n    }\n    collections(first: 3) {\n      nodes {\n        id\n        handle\n        title\n        description\n      }\n    }\n  }\n": typeof types.HeaderDocument,
    "\n  query HomePage($featuredCollectionHandle: String) {\n    featuredCollection: collection(handle: $featuredCollectionHandle) {\n      id\n      title\n      description\n      image {\n        altText\n        url\n      }\n      products(first: 20) {\n        nodes {\n          id\n          handle\n          title\n          description\n          featuredImage {\n            altText\n            url\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.HomePageDocument,
    "\n  query ProductExists($handle: String!) {\n    product(handle: $handle) {\n      id\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.ProductExistsDocument,
    "\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      title\n      description\n      handle\n      featuredImage {\n        id\n        altText\n        url\n      }\n      images(first: 10) {\n        nodes {\n          id\n          altText\n          url\n          width\n          height\n        }\n      }\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n": typeof types.ProductDocument,
    "\n  query SelectedProduct(\n    $handle: String!\n    $selectedOptions: [SelectedOptionInput!]!\n  ) {\n    product(handle: $handle) {\n      variantBySelectedOptions(\n        caseInsensitiveMatch: true\n        ignoreUnknownOptions: true\n        selectedOptions: $selectedOptions\n      ) {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image {\n          id\n          altText\n          url\n        }\n      }\n    }\n  }\n": typeof types.SelectedProductDocument,
};
const documents: Documents = {
    "\n  query GetVariant($productId: ID!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(id: $productId) {\n      variantBySelectedOptions(selectedOptions: $selectedOptions) {\n        id\n      }\n    }\n  }\n": types.GetVariantDocument,
    "\n  mutation CreateCart($input: CartInput!) {\n    cartCreate(input: $input) {\n      cart {\n        id\n      }\n    }\n  }\n": types.CreateCartDocument,
    "\n  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {\n    cartLinesAdd(cartId: $cartId, lines: $lines) {\n      cart {\n        id\n      }\n    }\n  }\n": types.AddToCartDocument,
    "\n  query Cart($cartId: ID!) {\n    cart(id: $cartId) {\n      id\n      totalQuantity\n      cost {\n        totalAmount {\n          amount\n          currencyCode\n        }\n      }\n      lines(first: 10) {\n        nodes {\n          id\n          quantity\n          merchandise {\n            ... on ProductVariant {\n              id\n              title\n              price {\n                amount\n                currencyCode\n              }\n              product {\n                id\n                title\n                handle\n                featuredImage {\n                  url\n                  altText\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.CartDocument,
    "\n  query Header {\n    shop {\n      name\n    }\n    collections(first: 3) {\n      nodes {\n        id\n        handle\n        title\n        description\n      }\n    }\n  }\n": types.HeaderDocument,
    "\n  query HomePage($featuredCollectionHandle: String) {\n    featuredCollection: collection(handle: $featuredCollectionHandle) {\n      id\n      title\n      description\n      image {\n        altText\n        url\n      }\n      products(first: 20) {\n        nodes {\n          id\n          handle\n          title\n          description\n          featuredImage {\n            altText\n            url\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n": types.HomePageDocument,
    "\n  query ProductExists($handle: String!) {\n    product(handle: $handle) {\n      id\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.ProductExistsDocument,
    "\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      title\n      description\n      handle\n      featuredImage {\n        id\n        altText\n        url\n      }\n      images(first: 10) {\n        nodes {\n          id\n          altText\n          url\n          width\n          height\n        }\n      }\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n": types.ProductDocument,
    "\n  query SelectedProduct(\n    $handle: String!\n    $selectedOptions: [SelectedOptionInput!]!\n  ) {\n    product(handle: $handle) {\n      variantBySelectedOptions(\n        caseInsensitiveMatch: true\n        ignoreUnknownOptions: true\n        selectedOptions: $selectedOptions\n      ) {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image {\n          id\n          altText\n          url\n        }\n      }\n    }\n  }\n": types.SelectedProductDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetVariant($productId: ID!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(id: $productId) {\n      variantBySelectedOptions(selectedOptions: $selectedOptions) {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetVariant($productId: ID!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(id: $productId) {\n      variantBySelectedOptions(selectedOptions: $selectedOptions) {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateCart($input: CartInput!) {\n    cartCreate(input: $input) {\n      cart {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCart($input: CartInput!) {\n    cartCreate(input: $input) {\n      cart {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {\n    cartLinesAdd(cartId: $cartId, lines: $lines) {\n      cart {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {\n    cartLinesAdd(cartId: $cartId, lines: $lines) {\n      cart {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Cart($cartId: ID!) {\n    cart(id: $cartId) {\n      id\n      totalQuantity\n      cost {\n        totalAmount {\n          amount\n          currencyCode\n        }\n      }\n      lines(first: 10) {\n        nodes {\n          id\n          quantity\n          merchandise {\n            ... on ProductVariant {\n              id\n              title\n              price {\n                amount\n                currencyCode\n              }\n              product {\n                id\n                title\n                handle\n                featuredImage {\n                  url\n                  altText\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Cart($cartId: ID!) {\n    cart(id: $cartId) {\n      id\n      totalQuantity\n      cost {\n        totalAmount {\n          amount\n          currencyCode\n        }\n      }\n      lines(first: 10) {\n        nodes {\n          id\n          quantity\n          merchandise {\n            ... on ProductVariant {\n              id\n              title\n              price {\n                amount\n                currencyCode\n              }\n              product {\n                id\n                title\n                handle\n                featuredImage {\n                  url\n                  altText\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Header {\n    shop {\n      name\n    }\n    collections(first: 3) {\n      nodes {\n        id\n        handle\n        title\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  query Header {\n    shop {\n      name\n    }\n    collections(first: 3) {\n      nodes {\n        id\n        handle\n        title\n        description\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HomePage($featuredCollectionHandle: String) {\n    featuredCollection: collection(handle: $featuredCollectionHandle) {\n      id\n      title\n      description\n      image {\n        altText\n        url\n      }\n      products(first: 20) {\n        nodes {\n          id\n          handle\n          title\n          description\n          featuredImage {\n            altText\n            url\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query HomePage($featuredCollectionHandle: String) {\n    featuredCollection: collection(handle: $featuredCollectionHandle) {\n      id\n      title\n      description\n      image {\n        altText\n        url\n      }\n      products(first: 20) {\n        nodes {\n          id\n          handle\n          title\n          description\n          featuredImage {\n            altText\n            url\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ProductExists($handle: String!) {\n    product(handle: $handle) {\n      id\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProductExists($handle: String!) {\n    product(handle: $handle) {\n      id\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      title\n      description\n      handle\n      featuredImage {\n        id\n        altText\n        url\n      }\n      images(first: 10) {\n        nodes {\n          id\n          altText\n          url\n          width\n          height\n        }\n      }\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      title\n      description\n      handle\n      featuredImage {\n        id\n        altText\n        url\n      }\n      images(first: 10) {\n        nodes {\n          id\n          altText\n          url\n          width\n          height\n        }\n      }\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SelectedProduct(\n    $handle: String!\n    $selectedOptions: [SelectedOptionInput!]!\n  ) {\n    product(handle: $handle) {\n      variantBySelectedOptions(\n        caseInsensitiveMatch: true\n        ignoreUnknownOptions: true\n        selectedOptions: $selectedOptions\n      ) {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image {\n          id\n          altText\n          url\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query SelectedProduct(\n    $handle: String!\n    $selectedOptions: [SelectedOptionInput!]!\n  ) {\n    product(handle: $handle) {\n      variantBySelectedOptions(\n        caseInsensitiveMatch: true\n        ignoreUnknownOptions: true\n        selectedOptions: $selectedOptions\n      ) {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image {\n          id\n          altText\n          url\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;