import { gql } from "@apollo/client";
import { Shop } from "./Shop";
import { User } from "./User";

class Address {
  constructor(
    public id: string = "",
    public label: string = "",
    public receiver: string = "",
    public phone: string = "",
    public city: string = "",
    public postalCode: string = "",
    public address: string = "",
    public main: boolean = false,
    public isDeleted: boolean = false,
    public user?: User
  ) {}

  static ADD_ADDRESS_MUTATION = gql`
    mutation addAddress(
      $label: String!
      $receiver: String!
      $phone: String!
      $city: String!
      $postalCode: String!
      $address: String!
    ) {
      addAddress(
        input: {
          label: $label
          receiver: $receiver
          phone: $phone
          city: $city
          postalCode: $postalCode
          address: $address
        }
      ) {
        id
      }
    }
  `;

  static UPDATE_ADDRESS_MUTATION = gql`
    mutation updateAddress(
      $id: ID!
      $label: String!
      $receiver: String!
      $phone: String!
      $city: String!
      $postalCode: String!
      $address: String!
    ) {
      updateAddress(
        id: $id
        input: {
          label: $label
          receiver: $receiver
          phone: $phone
          city: $city
          postalCode: $postalCode
          address: $address
        }
      ) {
        id
      }
    }
  `;

static DELETE_ADDRESS_MUTATION = gql`
mutation deleteAddress($id: ID!) {
  deleteAddress(id: $id) {
    id
  }
}
`;
  
static SET_MAIN_ADDRESS_MUTATION = gql`
mutation setMainAddress($id: ID!) {
  setMainAddress(id: $id) {
    id
  }
}
`;
}

export { Address };
