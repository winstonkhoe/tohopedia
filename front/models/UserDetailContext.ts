import { gql } from "@apollo/client";
import { User } from "./User";

class UserDetailContextModel {
  constructor(
    public getCurrentUser?: User,
  ) {}
}

export { UserDetailContextModel };
