import { createSlice } from "@reduxjs/toolkit";
import { OrdersPageState } from "../../../lib/types/screen";

const initialState: OrdersPageState = {
  pausedOrders: [],
  finishedOrders: [],
  processOrders: [],
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
  },
});

export const { setPausedOrders, setFinishedOrders, setProcessOrders } =
  ordersPageSlice.actions;

const OrdersPageReducer = ordersPageSlice.reducer;

export default OrdersPageReducer;
