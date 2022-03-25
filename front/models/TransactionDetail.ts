import { gql } from "@apollo/client";
import { Address } from "./Address";
import { Product } from "./Product";
import { Review } from "./Review";
import { Shop } from "./Shop";
import { Transaction } from "./Transaction";
import { User } from "./User";

class TransactionDetail {
  constructor(
    public id: string = "",
    public transaction: Transaction,
    public product: Product,
    public quantity: number,
    public note: string,
    public review: Review,
  ) {}
}

export { TransactionDetail };
