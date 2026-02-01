import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";

export interface MenuPageState {
  products: Product[];
  chosenProduct: Product | null;
  productsCache: { [key: string]: Product[] };
  lastFetch: { [key: string]: number };
  promotions: Product[];
  promotionsLoading: boolean;
}

const initialState: MenuPageState = {
  products: [],
  chosenProduct: null,
  productsCache: {},
  lastFetch: {},
  promotions: [],
  promotionsLoading: false,
};

const menuPageSlice = createSlice({
  name: "menuPage",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },

    setChosenProduct: (state, action: PayloadAction<Product | null>) => {
      state.chosenProduct = action.payload;
    },

    cacheProducts: (
      state,
      action: PayloadAction<{ queryKey: string; products: Product[] }>
    ) => {
      const { queryKey, products } = action.payload;
      state.productsCache[queryKey] = products;
      state.lastFetch[queryKey] = Date.now();
    },

    clearCache: (state) => {
      state.productsCache = {};
      state.lastFetch = {};
    },

    clearCacheByKey: (state, action: PayloadAction<string>) => {
      const queryKey = action.payload;
      delete state.productsCache[queryKey];
      delete state.lastFetch[queryKey];
    },

    setPromotions: (state, action: PayloadAction<Product[]>) => {
      state.promotions = action.payload;
      state.promotionsLoading = false;
    },

    setPromotionsLoading: (state, action: PayloadAction<boolean>) => {
      state.promotionsLoading = action.payload;
    },
  },
});

export const { setProducts, setChosenProduct, cacheProducts, clearCache, clearCacheByKey, setPromotions, setPromotionsLoading } =
  menuPageSlice.actions;

const MenuPageReducer = menuPageSlice.reducer;

export default MenuPageReducer;
