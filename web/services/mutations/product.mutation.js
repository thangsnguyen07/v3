import gql from "graphql-tag";

export const MUTATIONS_UPDATE_PRODUCT = gql`
  mutation updateProduct($product: ProductInput!) {
    productUpdate(input: $product) {
      product {
        id
      }
    }
  }
`;
