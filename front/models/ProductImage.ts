import { gql } from "@apollo/client";
import { Product } from "./Product";

class ProductImage {
  constructor(
    public id: string = "",
    public image: string = "",
    public product: Product
  ) {}
}

export { ProductImage };
