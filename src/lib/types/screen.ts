import { Member } from "./member";
import { Order } from "./orders";
import { Product } from "./product";
import { Review } from "./review";

/** REACT APP STATE */

export interface AppRootState {
  homePage: HomePageState;
  ordersPage: OrdersPageState;
}

/** HOMEPAGE */
export interface HomePageState {
  popularDishes: Product[];
  reviews: Review[];
  totalPages: number;
  totalCount: number;
}

/** PRODUCTS */

export interface ProductsPageState {
  restaurant: Member | null;
  chosenProduct: Product | null;
  products: Product[];
}

/** ORDERS */

export interface OrdersPageState {
  pausedOrders: Order[];
  finishedOrders: Order[];
  processOrders: Order[];
}
