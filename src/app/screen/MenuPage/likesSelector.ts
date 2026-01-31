import { createSelector } from "reselect";

const selectLikes = (state: any) => state.likes;

export const retrieveLikedProducts = createSelector(
  selectLikes,
  (likes) => likes.likedProducts
);

export const retrieveLikeCounts = createSelector(
  selectLikes,
  (likes) => likes.likeCounts
);

export const retrieveProductLikeStatus = (
  state: any,
  productId: string
) => {
  const liked = state.likes.likedProducts[productId] || false;
  const count = state.likes.likeCounts[productId] || 0;
  return { liked, count };
};
