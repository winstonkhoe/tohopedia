import { gql } from "@apollo/client";
import { Address } from "./Address";
import { Review } from "./Review";
import { Shop } from "./Shop";
import { TransactionDetail } from "./TransactionDetail";
import { User } from "./User";

class ReviewImage {
  constructor(
    public id: string = "",
    public review: Review,
    public image: string,
  ) {}
}

export { ReviewImage };
