import React from "react";
import { Box, Stack, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

import { retrieveCartItems } from "../OrderOnline/selector";
import { addToCart, removeFromCart, deleteFromCart } from "../OrderOnline/slice";
import { CartItem } from "../../../lib/types/search";
import { sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";

import "../../../css/menu.css";

/** REDUX ACTIONS */
const actionDispatch = (dispatch: Dispatch) => ({
  addToCart: (item: CartItem) => dispatch(addToCart(item)),
  removeFromCart: (item: CartItem) => dispatch(removeFromCart(item)),
  deleteFromCart: (item: CartItem) => dispatch(deleteFromCart(item)),
});

function OrderList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToCart: addToCartAction, removeFromCart: removeFromCartAction, deleteFromCart: deleteFromCartAction } = actionDispatch(dispatch as Dispatch);
  const cartItems = useSelector(retrieveCartItems);
  return (
    <Box className="menu2-right">
      <Box className="cart">
        <Box className="cart-title">Order list</Box>

        <Box className="cart-items">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item: CartItem) => (
              <Box key={item._id} className="cart-item">
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box className="cart-item-name">{item.name}</Box>
                  <IconButton 
                    className="cart-del"
                    onClick={() => {
                      deleteFromCartAction(item);
                      sweetTopSmallSuccessAlert("Removed from cart", 800);
                    }}
                  >
                    <DeleteOutlineRoundedIcon />
                  </IconButton>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                  <Stack direction="row" spacing={1} alignItems="center" className="cart-qty">
                    <IconButton 
                      className="qty-btn"
                      onClick={() => {
                        removeFromCartAction(item);
                      }}
                    >
                      <RemoveRoundedIcon />
                    </IconButton>
                    <Box className="qty-num">{item.quantity}</Box>
                    <IconButton 
                      className="qty-btn"
                      onClick={() => {
                        // Add a single item (quantity: 1) to increment the existing cart item
                        const singleItem = { ...item, quantity: 1 };
                        addToCartAction(singleItem);
                      }}
                    >
                      <AddRoundedIcon />
                    </IconButton>
                  </Stack>

                  <Box className="cart-price">₩{(item.price * item.quantity).toFixed(2)}</Box>
                </Stack>
              </Box>
            ))
          ) : (
            <Box className="cart-item">
              <Box className="cart-item-name">No items in cart</Box>
            </Box>
          )}
        </Box>

        <Box className="cart-divider" />

        <Stack spacing={1.2} className="cart-totals">
          <Stack direction="row" justifyContent="space-between">
            <Box className="tlabel">Subtotal</Box>
            <Box className="tval">₩{cartItems?.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0).toFixed(2) || "0.00"}</Box>
          </Stack>

          <Stack direction="row" justifyContent="space-between" className="total-row">
            <Box className="tlabel">Total</Box>
            <Box className="tval">₩{cartItems?.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0).toFixed(2) || "0.00"}</Box>
          </Stack>
        </Stack>

        <Button 
          className="checkout-btn" 
          variant="contained" 
          color="primary"
          disabled={!cartItems || cartItems.length === 0}
          onClick={() => navigate("/order-online")}
          sx={{
            position: 'sticky',
            bottom: 0,
            width: '100%',
            zIndex: 10,
          }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
}

export default OrderList;
