import { CartItem } from "./search";

export type OrderStatusUI = "PAUSED" | "ONGOING" | "FINISHED";

export type OrderItem = {
  id: string;
  name: string;
  img: string;
  price: number;
  qty: number;
};

export type OrderUI = {
  id: string;
  status: OrderStatusUI;
  restaurant: string;
  createdAt: string;
  etaMin?: number;
  items: OrderItem[];
};

export interface OrderOnlineProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
}
