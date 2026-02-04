import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Order } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import ReviewService from "../../services/ReviewService";

export interface Review {
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
}

export interface MyPageState {
  finishedOrders: Order[];
  reviews: Review[];
  loadingOrders: boolean;
  loadingReviews: boolean;
  errorOrders: string | null;
  errorReviews: string | null;
}

const initialState: MyPageState = {
  finishedOrders: [],
  reviews: [],
  loadingOrders: false,
  loadingReviews: false,
  errorOrders: null,
  errorReviews: null,
};

// Async thunks
export const fetchFinishedOrders = createAsyncThunk(
  "myPage/fetchFinishedOrders",
  async (_, { rejectWithValue }) => {
    try {
      const orderService = new OrderService();
      const orders = await orderService.getMyOrders({
        page: 1,
        limit: 20,
        orderStatus: OrderStatus.FINISH,
      });

      // Filter orders from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentOrders = orders.filter((order) => {
        const orderDate = new Date(order.updatedAt || order.createdAt);
        return orderDate >= thirtyDaysAgo;
      });

      return recentOrders;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

export const fetchMyReviews = createAsyncThunk(
  "myPage/fetchMyReviews",
  async (_, { rejectWithValue }) => {
    try {
      const reviewService = new ReviewService();
      const reviews = await reviewService.getMyReviews();
      return reviews;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch reviews");
    }
  }
);

const myPageSlice = createSlice({
  name: "myPage",
  initialState,
  reducers: {
    clearFinishedOrders: (state) => {
      state.finishedOrders = [];
    },
    clearReviews: (state) => {
      state.reviews = [];
    },
    updateReviewInState: (state, action: PayloadAction<Review>) => {
      const index = state.reviews.findIndex((r) => r._id === action.payload._id);
      if (index >= 0) {
        state.reviews[index] = action.payload;
      }
    },
    removeReviewFromState: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter((r) => r._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch Finished Orders
    builder
      .addCase(fetchFinishedOrders.pending, (state) => {
        state.loadingOrders = true;
        state.errorOrders = null;
      })
      .addCase(fetchFinishedOrders.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.finishedOrders = action.payload;
      })
      .addCase(fetchFinishedOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.errorOrders = action.payload as string;
      });

    // Fetch My Reviews
    builder
      .addCase(fetchMyReviews.pending, (state) => {
        state.loadingReviews = true;
        state.errorReviews = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loadingReviews = false;
        state.reviews = action.payload as any;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loadingReviews = false;
        state.errorReviews = action.payload as string;
      });
  },
});

export const { clearFinishedOrders, clearReviews, updateReviewInState, removeReviewFromState } =
  myPageSlice.actions;

const myPageReducer = myPageSlice.reducer;

export default myPageReducer;
