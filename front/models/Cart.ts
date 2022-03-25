import { gql } from "@apollo/client";
import { Address } from "./Address";
import { Product } from "./Product";
import { Shop } from "./Shop";
import { TransactionDetail } from "./TransactionDetail";
import { User } from "./User";

class Cart {
  constructor(
    public id: string = "",
    public product: Product,
    public user: User,
    public quantity: number = 0,
    public createdAt: string,
    public checked: boolean = false,
    public note: string = "",
  ) {}
}

export { Cart };
