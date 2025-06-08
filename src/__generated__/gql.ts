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
    "\n  query Header {\n    shop {\n      name\n    }\n    collections(first: 3) {\n      nodes {\n        id\n        handle\n        title\n        description\n      }\n    }\n  }\n": typeof types.HeaderDocument,
    "\n  query HomePage($featuredCollectionHandle: String) {\n    featuredCollection: collection(handle: $featuredCollectionHandle) {\n      id\n      title\n      description\n      image {\n        altText\n        url\n      }\n      products(first: 20) {\n        nodes {\n          id\n          handle\n          title\n          description\n          featuredImage {\n            altText\n            url\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.HomePageDocument,
    "\n  query ProductExists($handle: String!) {\n    product(handle: $handle) {\n      id\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.ProductExistsDocument,
    "\n  query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(handle: $handle) {\n      id\n      title\n      description\n      handle\n      featuredImage {\n        id\n        altText\n        url\n      }\n      images(first: 10) {\n        nodes {\n          id\n          altText\n          url\n        }\n      }\n      variantBySelectedOptions(caseInsensitiveMatch: true, ignoreUnknownOptions: true, selectedOptions: $selectedOptions) {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image {\n          id\n          altText\n          url\n        }\n      }\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n": typeof types.ProductDocument,
};
const documents: Documents = {
    "\n  query Header {\n    shop {\n      name\n    }\n    collections(first: 3) {\n      nodes {\n        id\n        handle\n        title\n        description\n      }\n    }\n  }\n": types.HeaderDocument,
    "\n  query HomePage($featuredCollectionHandle: String) {\n    featuredCollection: collection(handle: $featuredCollectionHandle) {\n      id\n      title\n      description\n      image {\n        altText\n        url\n      }\n      products(first: 20) {\n        nodes {\n          id\n          handle\n          title\n          description\n          featuredImage {\n            altText\n            url\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n": types.HomePageDocument,
    "\n  query ProductExists($handle: String!) {\n    product(handle: $handle) {\n      id\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.ProductExistsDocument,
    "\n  query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(handle: $handle) {\n      id\n      title\n      description\n      handle\n      featuredImage {\n        id\n        altText\n        url\n      }\n      images(first: 10) {\n        nodes {\n          id\n          altText\n          url\n        }\n      }\n      variantBySelectedOptions(caseInsensitiveMatch: true, ignoreUnknownOptions: true, selectedOptions: $selectedOptions) {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image {\n          id\n          altText\n          url\n        }\n      }\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n": types.ProductDocument,
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
export function gql(source: "\n  query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(handle: $handle) {\n      id\n      title\n      description\n      handle\n      featuredImage {\n        id\n        altText\n        url\n      }\n      images(first: 10) {\n        nodes {\n          id\n          altText\n          url\n        }\n      }\n      variantBySelectedOptions(caseInsensitiveMatch: true, ignoreUnknownOptions: true, selectedOptions: $selectedOptions) {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image {\n          id\n          altText\n          url\n        }\n      }\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {\n    product(handle: $handle) {\n      id\n      title\n      description\n      handle\n      featuredImage {\n        id\n        altText\n        url\n      }\n      images(first: 10) {\n        nodes {\n          id\n          altText\n          url\n        }\n      }\n      variantBySelectedOptions(caseInsensitiveMatch: true, ignoreUnknownOptions: true, selectedOptions: $selectedOptions) {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image {\n          id\n          altText\n          url\n        }\n      }\n      options {\n        id\n        name\n        optionValues {\n          id\n          name\n        }\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;