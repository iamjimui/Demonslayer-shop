import { ProductSize } from "./product-size";

export interface Product {
  _id: string,
  userId: string,
  productTypeId: string,
  name: string,
  description: string,
  price: number,
  productPrice: number,
  image: string,
  productSize: ProductSize,
  quantity: number
}
