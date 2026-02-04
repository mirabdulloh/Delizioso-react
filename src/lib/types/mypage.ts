/**
 * MyPage Types
 * Types for Finished Orders and Reviews sections
 */

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  img: string;
  price: number;
  qty: number;
  hasReview?: boolean;
}

export interface OrderUI {
  id: string;
  restaurant: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
}

export interface EditingReview {
  _id: string;
  memberId: string;
  productId: {
    _id: string;
    productName: string;
    productImages: string[];
  };
  orderId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  editableUntil: Date;
  tempRating?: number;
  tempComment?: string;
  isSubmitting?: boolean;
}

export interface ReviewModalState {
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
}
