import { gql } from "@apollo/client";

class Admin {
  constructor() {}

  static TRANSACTION_PER_DAY_QUERY = gql`
    query transactionsPerDay{
      transactionsPerDay
    }
  `;

  static TRANSACTION_PER_SHIPMENT_TYPE_QUERY = gql`
    query transactionsPerShipmentType{
      transactionsPerShipmentType
    }
  `;

  static PRODUCT_PER_CATEGORY_QUERY = gql`
    query productPerCategory{
      productsPerCategory
    }
  `;

}

export { Admin };
