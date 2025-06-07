import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

export class GraphQLError extends Error {
  locations?: unknown;
  path?: unknown;
  extensions?: unknown;
  data?: unknown;
  constructor(message: string) {
    super(message);
    this.name = "GraphQLError";
  }
}

export class GraphQLAggregateError extends AggregateError {
  data?: unknown;
}

export async function fetchGraphQL<Query, Variables>(
  url: string | URL,
  query: TypedDocumentNode<Query, Variables>,
  variables?: Variables,
  init?: Omit<RequestInit, "body" | "method">
) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  const response = await fetch(url, {
    ...init,
    body: JSON.stringify({ query: print(query), variables }),
    headers,
    method: "POST",
  });

  if (response.status < 200 || response.status >= 300) {
    const body = await response.text();
    throw new Error(
      `GraphQL query failed with status ${response.status}:\n\n${body}`
    );
  }

  const { data, errors } = (await response.json()) as {
    data: Query;
    errors?: {
      message: string;
      locations?: unknown;
      path?: unknown;
      extensions?: unknown;
    }[];
  };

  if (errors != null && errors.length > 0) {
    const jsErrors = errors.map((error) => {
      const jsError = new GraphQLError(error.message);

      if (error.locations != null) jsError.locations = error.locations;
      if (error.path != null) jsError.path = error.path;
      if (error.extensions != null) jsError.extensions = error.extensions;

      return jsError;
    });

    const jsError =
      jsErrors.length > 1 ? new GraphQLAggregateError(jsErrors) : jsErrors[0];

    if (data != null) {
      jsError.data = data;
    }

    throw jsError;
  }

  return data;
}
