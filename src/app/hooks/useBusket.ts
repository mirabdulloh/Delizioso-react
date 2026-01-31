import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "../../lib/types/search";
import { addToCart, removeFromCart, deleteFromCart, clearCart } from "../screen/OrderOnline/slice";
import { retrieveCartItems } from "../screen/OrderOnline/selector";

const useBusket = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(retrieveCartItems);

  /** ADD ITEM */
  const onAdd = (input: CartItem) => {
    dispatch(addToCart(input));
  };

  /** REMOVE ITEM */
  const onRemove = (input: CartItem) => {
    dispatch(removeFromCart(input));
  };

  /** DELETE ITEM */
  const onDelete = (input: CartItem) => {
    dispatch(deleteFromCart(input));
  };

  /** CLEAR ALL */
  const onDeleteAll = () => {
    dispatch(clearCart());
  }

  return { cartItems, onAdd, onRemove, onDelete, onDeleteAll };
};

export default useBusket;
