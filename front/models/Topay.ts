import { gql } from "@apollo/client";
import { Shop } from "./Shop";
import { User } from "./User";

class Topay {
  constructor(
    public id: string = "",
    public balance: number = 0,
    public coin: number = 0,
  ) {}
}

export { Topay };
