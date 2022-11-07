import { gql } from "@apollo/client";
import { Category } from "./Category";
import { ProductImage } from "./ProductImage";
import { Shop } from "./Shop";

class Product {
  constructor(
    public id: string = "",
    public originalId: string = "",
    public name: string = "",
    public images: ProductImage[],
    public description: string = "",
    public price: number,
    public discount: number,
    public stock: number,
    public sold: number,
    public metadata: string = "",
    public createdAt: string,
    public validTo: string,
    public category: Category,
    public shop: Shop
  ) { }
  
  static ALL_PRODUCT_QUERY = gql`
  query GetProducts(
    $id: String
    $slug: String
    $categoryId: String
    $keyword: String
    $limit: Int
    $offset: Int
    $order: String
    $recommendation: Boolean
    $shopTypes: [Int]
    $bestSeller: Boolean
  ) {
    products(
      id: $id
      slug: $slug
      categoryId: $categoryId
      keyword: $keyword
      limit: $limit
      offset: $offset
      order: $order
      recommendation: $recommendation
      shopTypes: $shopTypes
      bestSeller: $bestSeller
    ) {
      id
      name
      price
      discount
      createdAt
      sold
      category {
        id
        name
      }
      images {
        image
      }
      shop {
        name
        city
        type
      }
    }
  }
`;
}

export { Product };
