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


export { CATEGORY_QUERY, GET_ALL_USER_QUERY};
