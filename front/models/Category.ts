import { gql } from "@apollo/client";
import { Product } from "./Product";
import { Shop } from "./Shop";

class Category {
  constructor(
    public id: string = "",
    public name: string = "",
    public products: Product[],
  ) {}
}

export { Category };
