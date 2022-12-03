import { graphql } from "./graphql.js";
import {
  QUERY_GET_PRODUCTS,
  QUERY_GET_PRODUCTS_TAGS,
} from "./queries/product.query.js";

export const getProductTags = async (session, first) => {
  return await graphql({
    session,
    query: QUERY_GET_PRODUCTS_TAGS,
    variables: {
      first: first,
    },
  });
};

export const getProducts = async (session, first) => {
  return await graphql({
    session,
    query: QUERY_GET_PRODUCTS,
    variables: {
      first: first,
    },
  });
};
