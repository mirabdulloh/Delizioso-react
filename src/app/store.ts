import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import HomePageReducer from "./screen/HomePage/slice";
import OrdersPageReducer from "./screen/OrderOnline/slice";
import MenuPageReducer from "./screen/MenuPage/slice";
import LikesReducer from "./screen/MenuPage/likesSlice";
import MyPageReducer from "./screen/MyPage/slice";
import reduxLogger from "redux-logger";

export const store = configureStore({
  // @ts-ignore
  middleware: (getDefaultMiddleware) => {
    const baseMiddleware = getDefaultMiddleware();

    if (process.env.NODE_ENV === "development") {
      return baseMiddleware.concat(reduxLogger);
    }

    return baseMiddleware;
  },

  reducer: {
    homePage: HomePageReducer,
    ordersPage: OrdersPageReducer,
    menuPage: MenuPageReducer,
    likes: LikesReducer,
    myPage: MyPageReducer,
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
