import { gql } from "@apollo/client";

const ADD_PRODUCT_MUTATION = gql`
  mutation addProduct(
    $name: String!
    $description: String!
    $images: [String!]!
    $stock: Int!
    $price: Int!
    $discount: Int!
    $metadata: String
    $categoryId: String!
  ) {
    addProduct(
      input: {
        name: $name
        description: $description
        images: $images
        stock: $stock
        price: $price
        discount: $discount
        metadata: $metadata
        categoryId: $categoryId
      }
    ) {
      id
    }
  }
`;

const SUSPEND_USER_MUTATION = gql`
  mutation SuspendUser($id: ID!, $bool: Boolean!) {
    suspendUser(id: $id, bool: $bool) {
      id
    }
  }
`;

const REQUEST_UNSUSPEND_USER_MUTATION = gql`
  mutation requestUnsuspend($id: ID!) {
    requestUnsuspend(id: $id) {
      id
    }
  }
`;

const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($id: ID!) {
    verifyEmailAddress(id: $id)
  }
`;

export {
  ADD_PRODUCT_MUTATION,
  SUSPEND_USER_MUTATION,
  REQUEST_UNSUSPEND_USER_MUTATION,
  VERIFY_EMAIL_MUTATION,
};
