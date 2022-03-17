import { gql } from "@apollo/client";

const CATEGORY_QUERY = gql`
  query GetAllCategories {
    categories {
      id
      name
    }
  }
`;

const GET_ALL_USER_QUERY = gql`
  query AllUser($limit: Int!, $offset: Int!) {
    users(limit: $limit, offset: $offset) {
      id
      name
      image
      dob
      gender
      email
      phone
      isSuspended
      isAdmin
      requestUnsuspend
    }
  }
`;

const ALL_PRODUCT_QUERY = gql`
  query GetProducts(
    $id: String
    $slug: String
    $categoryId: String
    $keyword: String
    $limit: Int
    $offset: Int
    $order: String
    $recommendation: Boolean
    $shopTypes: [Int]
  ) {
    products(
      id: $id
      slug: $slug
      categoryId: $categoryId
      keyword: $keyword
      limit: $limit
      offset: $offset
      order: $order
      recommendation: $recommendation
      shopTypes: $shopTypes
    ) {
      id
      name
      price
      discount
      createdAt
      category {
        id
        name
      }
      images {
        image
      }
      shop {
        name
        city
        type
      }
    }
  }
`;

export { CATEGORY_QUERY, GET_ALL_USER_QUERY, ALL_PRODUCT_QUERY };
