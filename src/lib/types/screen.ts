import { Member } from "./member";
import { Order } from "./orders";
import { Product } from "./product";
import { Review } from "./review";
import { CartItem } from "./search";

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

/** MENU PAGE */

export interface MenuPageState {
  products: Product[];
  productsCache: { [key: string]: Product[] };
  lastFetch: { [key: string]: number };
}

export interface MenuPageProps {
  onAdd?: (item: CartItem) => void;
  onRemove?: (item: CartItem) => void;
  onDelete?: (item: CartItem) => void;
}

export interface UpdateProductLikePayload {
  productId: string;
  liked: boolean;
  likesCount: number;
}

/** ORDERS */

export interface OrdersPageState {
  pausedOrders: Order[];
  finishedOrders: Order[];
  processOrders: Order[];
  cartItems: CartItem[];
}
