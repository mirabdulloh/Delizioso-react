import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import HomePageReducer from "./screen/HomePage/slice";
import OrdersPageReducer from "./screen/OrderOnline/slice";
import MenuPageReducer from "./screen/MenuPage/slice";
import LikesReducer from "./screen/MenuPage/likesSlice";
import reduxLogger from "redux-logger";

export const store = configureStore({
  // @ts-ignore
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reduxLogger),

  reducer: {
    homePage: HomePageReducer,
    ordersPage: OrdersPageReducer,
    menuPage: MenuPageReducer,
    likes: LikesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
