import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrdersPageState } from "../../../lib/types/screen";
import { CartItem } from "../../../lib/types/search";

const initialState: OrdersPageState = {
  pausedOrders: [],
  finishedOrders: [],
  processOrders: [],
  cartItems: [],
};

const ordersPageSlice = createSlice({
  name: "ordersPage",
  initialState,
  reducers: {
    setPausedOrders: (state, action) => {
      state.pausedOrders = action.payload;
    },
    setFinishedOrders: (state, action) => {
      state.finishedOrders = action.payload;
    },
    setProcessOrders: (state, action) => {
      state.processOrders = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exist = state.cartItems.find((item: CartItem) => item._id === action.payload._id);
      
      if (exist) {
        state.cartItems = state.cartItems.map((item: CartItem) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        state.cartItems.push({ ...action.payload });
      }
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      const exist = state.cartItems.find((item: CartItem) => item._id === action.payload._id);
      
      if (!exist) return;
      
      if (exist.quantity === 1) {
        state.cartItems = state.cartItems.filter((item: CartItem) => item._id !== action.payload._id);
      } else {
        state.cartItems = state.cartItems.map((item: CartItem) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    },
    deleteFromCart: (state, action: PayloadAction<CartItem>) => {
      state.cartItems = state.cartItems.filter((item: CartItem) => item._id !== action.payload._id);
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { setPausedOrders, setFinishedOrders, setProcessOrders, addToCart, removeFromCart, deleteFromCart, clearCart } =
  ordersPageSlice.actions;

const OrdersPageReducer = ordersPageSlice.reducer;

export default OrdersPageReducer;
