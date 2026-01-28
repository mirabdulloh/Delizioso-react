import {
  ProductCollection,
  ProductSize,
  ProductStatus,
} from "../enums/product.enum";

export interface Product {
  imagePath: any;
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSize: ProductSize;
  productVolume: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  productLikes: number;
  productRank?: number;
  productReviewCount?: number;
  productReview?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}
