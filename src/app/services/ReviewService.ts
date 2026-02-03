import axios from "axios";
import { serverApi } from "../../lib/config";

export interface CreateReviewInput {
  orderId: string;
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  reviewId: string;
  rating?: number;
  comment?: string;
}

export interface Review {
  _id: string;
  memberId: {
    _id: string;
    memberNick: string;
    memberImage?: string;
  };
  productId: {
    _id: string;
    productName: string;
    productImages?: string[];
  };
  orderId: string;
  rating: number;
  comment?: string;
  status: string;
  isLowRating: boolean;
  createdAt: string;
  updatedAt: string;
  editableUntil?: string;
  lastEditedAt?: string;
  editCount?: number;
}

export interface ReviewMessage {
  _id: string;
  reviewId: string;
  senderType: "ADMIN" | "MEMBER";
  senderId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

class ReviewService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async createReview(input: CreateReviewInput): Promise<Review> {
    try {
      const url = `${this.path}/member/create/review`;
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("createReview:", result);
      return result.data;
    } catch (err) {
      console.log("ReviewService - createReview error:", err);
      throw err;
    }
  }

  public async updateReview(input: UpdateReviewInput): Promise<Review> {
    try {
      const url = `${this.path}/member/update/review`;
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("updateReview:", result);
      return result.data;
    } catch (err) {
      console.log("ReviewService - updateReview error:", err);
      throw err;
    }
  }

  public async getMyReviews(): Promise<Review[]> {
    try {
      const url = `${this.path}/member/my/reviews`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getMyReviews:", result);
      return result.data;
    } catch (err) {
      console.log("ReviewService - getMyReviews error:", err);
      throw err;
    }
  }

  public async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: Review[]; total: number; page: number; limit: number }> {
    try {
      const url = `${this.path}/public/product/review/${productId}?page=${page}&limit=${limit}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getProductReviews:", result);
      return result.data;
    } catch (err) {
      console.log("ReviewService - getProductReviews error:", err);
      throw err;
    }
  }

  public async getTopReviews(limit: number = 10): Promise<Review[]> {
    try {
      const url = `${this.path}/public/top/reviews?limit=${limit}`;
      const result = await axios.get(url);
      console.log("getTopReviews:", result);
      return result.data;
    } catch (err) {
      console.log("ReviewService - getTopReviews error:", err);
      throw err;
    }
  }

  public async getReviewMessages(reviewId: string): Promise<ReviewMessage[]> {
    try {
      const url = `${this.path}/member/review/messages/${reviewId}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getReviewMessages:", result);
      return result.data;
    } catch (err) {
      console.log("ReviewService - getReviewMessages error:", err);
      throw err;
    }
  }
}

export default ReviewService;
