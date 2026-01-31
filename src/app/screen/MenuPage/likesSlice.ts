import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LikesState {
  likedProducts: { [productId: string]: boolean }; // Track which products are liked
  likeCounts: { [productId: string]: number }; // Track like counts
}

const initialState: LikesState = {
  likedProducts: {},
  likeCounts: {},
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    // Update single product like status
    updateProductLike: (
      state,
      action: PayloadAction<{
        productId: string;
        liked: boolean;
        likesCount: number;
      }>
    ) => {
      const { productId, liked, likesCount } = action.payload;
      state.likedProducts[productId] = liked;
      state.likeCounts[productId] = likesCount;
    },

    // Set multiple product likes at once
    setProductLikes: (
      state,
      action: PayloadAction<{
        [productId: string]: { liked: boolean; count: number };
      }>
    ) => {
      Object.entries(action.payload).forEach(
        ([productId, { liked, count }]) => {
          state.likedProducts[productId] = liked;
          state.likeCounts[productId] = count;
        }
      );
    },

    // Clear all likes cache
    clearLikesCache: (state) => {
      state.likedProducts = {};
      state.likeCounts = {};
    },
  },
});

export const { updateProductLike, setProductLikes, clearLikesCache } =
  likesSlice.actions;

export default likesSlice.reducer;
