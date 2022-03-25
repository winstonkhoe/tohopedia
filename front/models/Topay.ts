import { gql } from "@apollo/client";
import { Shop } from "./Shop";
import { User } from "./User";

class Topay {
  constructor(
    public id: string = "",
    public balance: number = 0,
    public coin: number = 0,
    public user: User = new User("", "", "", "", "", 0, "", "", false, false, false, false, 0, new Shop, new Topay(), [])
  ) {}
}

export { Topay };
