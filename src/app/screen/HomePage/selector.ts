import { createSelector } from "reselect";
import { RootState } from "../../store";

const selectHomePage = (state: RootState) => state.homePage;

export const retrievePopularDishes = createSelector(
  selectHomePage,
  (homePage) => homePage.popularDishes || []
);

export const retrieveReviews = createSelector(
  selectHomePage,
  (homePage) => homePage.reviews || []
);

export const retrievePaginationInfo = createSelector(
  selectHomePage,
  (homePage) => ({
    totalPages: homePage.totalPages,
    totalCount: homePage.totalCount,
  })
);
