import { Shopify } from "@shopify/shopify-api";
import { print } from "graphql/language/printer.mjs";

export async function graphql({ session, query, variables }) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  try {
    return await client.query({
      data: {
        query: print(query),
        variables,
      },
    });
  } catch (error) {
    if (error instanceof Shopify.Errors.GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
