import React from "react";
import { Box, Stack, Button, IconButton } from "@mui/material";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

import "../../../css/menu.css";

function OrderList() {
  return (
    <Box className="menu2-right">
      <Box className="cart">
        <Box className="cart-title">Order list</Box>

        <Box className="cart-items">
          <Box className="cart-item">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box className="cart-item-name">Spaghetti</Box>
              <IconButton className="cart-del">
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
              <Stack direction="row" spacing={1} alignItems="center" className="cart-qty">
                <IconButton className="qty-btn">
                  <RemoveRoundedIcon />
                </IconButton>
                <Box className="qty-num">2</Box>
                <IconButton className="qty-btn">
                  <AddRoundedIcon />
                </IconButton>
              </Stack>

              <Box className="cart-price">$24.10</Box>
            </Stack>
          </Box>

          <Box className="cart-item">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box className="cart-item-name">Pizza</Box>
              <IconButton className="cart-del">
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
              <Stack direction="row" spacing={1} alignItems="center" className="cart-qty">
                <IconButton className="qty-btn">
                  <RemoveRoundedIcon />
                </IconButton>
                <Box className="qty-num">2</Box>
                <IconButton className="qty-btn">
                  <AddRoundedIcon />
                </IconButton>
              </Stack>

              <Box className="cart-price">$35.70</Box>
            </Stack>
          </Box>

          <Box className="cart-item">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box className="cart-item-name">Caesar salad</Box>
              <IconButton className="cart-del">
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
              <Stack direction="row" spacing={1} alignItems="center" className="cart-qty">
                <IconButton className="qty-btn">
                  <RemoveRoundedIcon />
                </IconButton>
                <Box className="qty-num">2</Box>
                <IconButton className="qty-btn">
                  <AddRoundedIcon />
                </IconButton>
              </Stack>

              <Box className="cart-price">$18.50</Box>
            </Stack>
          </Box>
        </Box>

        <Box className="cart-divider" />
        <Box className="cart-subtitle">Voucher Code</Box>

        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
          <Box className="voucher-code">FREETOEAT</Box>
          <Box className="voucher-add">
            <AddRoundedIcon />
          </Box>
        </Stack>

        <Box className="cart-divider" />

        <Stack spacing={1.2} className="cart-totals">
          <Stack direction="row" justifyContent="space-between">
            <Box className="tlabel">Subtotal</Box>
            <Box className="tval">$78.3</Box>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Box className="tlabel">Tax fee</Box>
            <Box className="tval">$3.5</Box>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Box className="tlabel">Voucher</Box>
            <Box className="tval">$5.0</Box>
          </Stack>

          <Stack direction="row" justifyContent="space-between" className="total-row">
            <Box className="tlabel">Total</Box>
            <Box className="tval">$76.8</Box>
          </Stack>
        </Stack>

        <Button className="checkout-btn" variant="contained" color="primary">
          Checkout
        </Button>
      </Box>
    </Box>
  );
}

export default OrderList;
