import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";

export interface MenuPageState {
  products: Product[];
  productsCache: { [key: string]: Product[] }; // Cache by query key
  singleProductCache: { [id: string]: Product }; // Cache individual products
  lastFetch: { [key: string]: number }; // Track fetch time for cache invalidation
}

const initialState: MenuPageState = {
  products: [],
  productsCache: {},
  singleProductCache: {},
  lastFetch: {},
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const menuPageSlice = createSlice({
  name: "menuPage",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    
    // Cache products with query key
    cacheProducts: (
      state,
      action: PayloadAction<{ queryKey: string; products: Product[] }>
    ) => {
      const { queryKey, products } = action.payload;
      state.productsCache[queryKey] = products;
      state.lastFetch[queryKey] = Date.now();
      
      // Also cache individual products
      products.forEach((product) => {
        state.singleProductCache[product._id] = product;
      });
    },

    // Cache single product
    cacheProduct: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      state.singleProductCache[product._id] = product;
      state.lastFetch[`product_${product._id}`] = Date.now();
    },

    // Update product like status in cache
    updateProductLike: (
      state,
      action: PayloadAction<{ productId: string; liked: boolean; likesCount: number }>
    ) => {
      const { productId, liked, likesCount } = action.payload;

      // Update in single product cache
      if (state.singleProductCache[productId]) {
        state.singleProductCache[productId].memberLiked = liked;
        state.singleProductCache[productId].productLikes = likesCount;
      }

      // Update in all cached product lists
      Object.keys(state.productsCache).forEach((key) => {
        const products = state.productsCache[key];
        const productIndex = products.findIndex((p) => p._id === productId);
        if (productIndex !== -1) {
          state.productsCache[key][productIndex].memberLiked = liked;
          state.productsCache[key][productIndex].productLikes = likesCount;
        }
      });

      // Update in current products list
      const currentProductIndex = state.products.findIndex(
        (p) => p._id === productId
      );
      if (currentProductIndex !== -1) {
        state.products[currentProductIndex].memberLiked = liked;
        state.products[currentProductIndex].productLikes = likesCount;
      }
    },

    // Clear cache
    clearCache: (state) => {
      state.productsCache = {};
      state.singleProductCache = {};
      state.lastFetch = {};
    },

    // Clear specific cache
    clearCacheByKey: (state, action: PayloadAction<string>) => {
      const queryKey = action.payload;
      delete state.productsCache[queryKey];
      delete state.lastFetch[queryKey];
    },
  },
});

export const {
  setProducts,
  cacheProducts,
  cacheProduct,
  updateProductLike,
  clearCache,
  clearCacheByKey,
} = menuPageSlice.actions;

const MenuPageReducer = menuPageSlice.reducer;

export default MenuPageReducer;

// Selectors
export const selectProducts = (state: any) => state.menuPage.products;
export const selectProductById = (state: any, productId: string) =>
  state.menuPage.singleProductCache[productId];
export const selectCachedProducts = (state: any, queryKey: string) => {
  const lastFetch = state.menuPage.lastFetch[queryKey];
  if (!lastFetch || Date.now() - lastFetch > CACHE_DURATION) {
    return null;
  }
  return state.menuPage.productsCache[queryKey] || null;
};
