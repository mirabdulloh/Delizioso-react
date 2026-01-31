import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";

export interface MenuPageState {
  products: Product[];
  productsCache: { [key: string]: Product[] };
  lastFetch: { [key: string]: number };
}

const initialState: MenuPageState = {
  products: [],
  productsCache: {},
  lastFetch: {},
};

const menuPageSlice = createSlice({
  name: "menuPage",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
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
  },
});

export const { setProducts, cacheProducts, clearCache, clearCacheByKey } =
  menuPageSlice.actions;

const MenuPageReducer = menuPageSlice.reducer;

export default MenuPageReducer;
