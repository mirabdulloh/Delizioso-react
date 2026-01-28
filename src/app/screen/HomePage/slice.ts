import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";

const initialState: HomePageState = {
  popularDishes: [],
  reviews: [],
  totalPages: 0,
  totalCount: 0,
};

const homePageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setPopularDishes: (state, action) => {
      state.popularDishes = action.payload;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setPaginationInfo: (state, action) => {
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
    },
  },
});

export const { setPopularDishes, setReviews, setPaginationInfo } = homePageSlice.actions;

const HomePageReducer = homePageSlice.reducer;

export default HomePageReducer;
