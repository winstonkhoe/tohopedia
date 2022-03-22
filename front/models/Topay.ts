import { gql } from "@apollo/client";
import { User } from "./User";

class Topay {
  constructor(
    public id: string = "",
    public balance: number = 0,
    public coin: number = 0,
    public user: User
  ) {}
}

export { Topay };
