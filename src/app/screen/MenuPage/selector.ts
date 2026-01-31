import { createSelector } from "reselect";
import { RootState } from "../../store";

const selectMenuPage = (state: RootState) => state.menuPage;

export const retrieveProducts = createSelector(
  selectMenuPage,
  (menuPage) => menuPage.products || []
);

export const retrieveChosenProduct = createSelector(
  selectMenuPage,
  (menuPage) => menuPage.chosenProduct
);

export const retrieveProductsCache = createSelector(
  selectMenuPage,
  (menuPage) => menuPage.productsCache
);

export const retrieveLastFetch = createSelector(
  selectMenuPage,
  (menuPage) => menuPage.lastFetch
);

