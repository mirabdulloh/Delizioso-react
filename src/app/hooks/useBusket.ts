import { useState } from "react";
import { CartItem } from "../../lib/types/search";

const useBusket = () => {
  const cartJson = localStorage.getItem("cartData");
  const currentCart = cartJson ? JSON.parse(cartJson) : [];

  const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);

  /** ADD ITEM */
  const onAdd = (input: CartItem) => {
    const exist = cartItems.find((item) => item._id === input._id);

    let updatedCart;

    if (exist) {
      updatedCart = cartItems.map((item) =>
        item._id === input._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...input }];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  /** REMOVE ITEM */
  const onRemove = (input: CartItem) => {
    const exist = cartItems.find((item) => item._id === input._id);

    if (!exist) return;

    let updatedCart;

    if (exist.quantity === 1) {
      updatedCart = cartItems.filter((item) => item._id !== input._id);
    } else {
      updatedCart = cartItems.map((item) =>
        item._id === input._id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };


  const onDelete = (input: CartItem) => {
    const updatedCart = cartItems.filter((item) => item._id !== input._id);
    setCartItems(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  const onDeleteAll = () => {
    setCartItems([]);
    localStorage.removeItem("cartData");
  }

  return { cartItems, onAdd, onRemove, onDelete, onDeleteAll };
};

export default useBusket;
