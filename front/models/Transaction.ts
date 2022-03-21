import { gql } from "@apollo/client";
import { Address } from "./Address";
import { Shop } from "./Shop";
import { TransactionDetail } from "./TransactionDetail";
import { User } from "./User";

class Transaction {
  constructor(
    public id: string = "",
    public user: User,
    public shop: Shop,
    public date: string,
    public status: number,
    public method: string,
    public address: Address,
    public details: TransactionDetail[],
  ) {}
}

export { Transaction };
