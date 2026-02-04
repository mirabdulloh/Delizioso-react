import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Orders from "./OrderOnline";
import type { OrderOnlineProps } from "../../../lib/types/order-online";
import { addToCart, removeFromCart, deleteFromCart } from "./slice";
import { retrieveCartItems } from "./selector";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";

function OrderOnlineWrapper(props?: Partial<OrderOnlineProps>) {
  const navigate = useNavigate();
  const { authMember } = useGlobals();
  const dispatch = useDispatch<Dispatch>();
  const cartItems = useSelector(retrieveCartItems);

  const onAdd = (item: CartItem) => dispatch(addToCart(item));
  const onRemove = (item: CartItem) => dispatch(removeFromCart(item));
  const onDelete = (item: CartItem) => dispatch(deleteFromCart(item));

  // ✅ Redirect non-authenticated users
  useEffect(() => {
    if (!authMember) {
      navigate("/");
    }
  }, [authMember, navigate]);

  return (
    <Orders
      cartItems={props?.cartItems ?? cartItems}
      onAdd={props?.onAdd ?? onAdd}
      onRemove={props?.onRemove ?? onRemove}
      onDelete={props?.onDelete ?? onDelete}
    />
  );
}
export default OrderOnlineWrapper;
