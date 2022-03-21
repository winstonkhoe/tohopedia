import { gql } from "@apollo/client";
import { ReviewImage } from "./ReviewImage";
import { Shop } from "./Shop";
import { TransactionDetail } from "./TransactionDetail";
import { User } from "./User";

class Review {
  constructor(
    public id: string = "",
    public user: User,
    public shop: Shop,
    public images: ReviewImage[],
    public rating: number,
    public message: string,
    public anonymous: boolean,
    public createdAt: string,
    public transactionDetail: TransactionDetail
  ) {}

  static ADD_REVIEW_MUTATION = gql`
    mutation addReview(
      $transactionDetailId: String!
      $shopId: String!
      $rating: Int!
      $message: String
      $anonymous: Boolean!
      $images: [String]
    ) {
      addReview(
        input: {
          transactionDetailId: $transactionDetailId
          shopId: $shopId
          rating: $rating
          message: $message
          anonymous: $anonymous
          images: $images
        }
      ) {
        id
      }
    }
  `;
}

export { Review };
