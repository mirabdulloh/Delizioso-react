import { RootState } from "../../store";

export const selectFinishedOrders = (state: RootState) => state.myPage.finishedOrders;
export const selectMyReviews = (state: RootState) => state.myPage.reviews;
export const selectLoadingOrders = (state: RootState) => state.myPage.loadingOrders;
export const selectLoadingReviews = (state: RootState) => state.myPage.loadingReviews;
export const selectErrorOrders = (state: RootState) => state.myPage.errorOrders;
export const selectErrorReviews = (state: RootState) => state.myPage.errorReviews;

// Selector to get reviews for a specific product in an order
export const selectReviewForProduct = (orderId: string, productId: string) => (state: RootState) => {
  return state.myPage.reviews.find(
    (r) =>
      String(r.orderId) === String(orderId) &&
      String(r.productId._id || r.productId) === String(productId)
  );
};

// Selector to check if a product has a review
export const selectHasReviewForProduct = (orderId: string, productId: string) => (state: RootState) => {
  return state.myPage.reviews.some(
    (r) =>
      String(r.orderId) === String(orderId) &&
      String(r.productId._id || r.productId) === String(productId)
  );
};
