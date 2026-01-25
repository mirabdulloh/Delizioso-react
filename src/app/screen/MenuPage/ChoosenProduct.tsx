import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Button,
  Rating,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import "../../../css/menu.css";

function ChoosenProduct() {
  const images = [
    "/imgs/pastas.jpg",
    "/imgs/default_img.jpg",
    "/imgs/pastas.jpg",
    "/imgs/pastas.jpg",
  ];

  const [activeImg, setActiveImg] = useState(images[0]);
  const [qty, setQty] = useState(1);

  return (
    <div className="cp-section">
      <Container className="cp-container">
        {/* TOP BAR */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" className="cp-topbar">
          <Button className="cp-back" startIcon={<ArrowBackRoundedIcon />} href="/products">
            Back
          </Button>

          <Stack direction="row" spacing={1}>
            <Box className="cp-pill">
              <LocalFireDepartmentRoundedIcon />
              <span>Best Seller</span>
            </Box>
            <Box className="cp-pill">
              <AccessTimeRoundedIcon />
              <span>Ready in 15 min</span>
            </Box>
          </Stack>
        </Stack>

        {/* MAIN GRID */}
        <Box className="cp-grid">
          {/* LEFT: GALLERY */}
          <Box className="cp-left">
            <Box className="cp-gallery">
              {/* IMAGE */}
              <Box className="cp-mainImgWrap">
                <Box component="img" src={activeImg} alt="product" className="cp-mainImg" />
                {/* FLOAT ICONS */}
                <Stack direction="row" spacing={1} className="cp-floatIcons">
                  <Box className="cp-miniPill">
                    <FavoriteBorderRoundedIcon />
                    <span>124</span>
                  </Box>
                  <Box className="cp-miniPill">
                    <RemoveRedEyeRoundedIcon />
                    <span>1800</span>
                  </Box>
                </Stack>
              </Box>

              {/* THUMBS */}
              <Stack direction="row" spacing={1.4} className="cp-thumbs">
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    className={`cp-thumb ${activeImg === img ? "active" : ""}`}
                    role="button"
                    onClick={() => setActiveImg(img)}
                  >
                    <Box component="img" src={img} alt="thumb" />
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* DETAILS */}
            <Box className="cp-details">
              <Box className="cp-title">Spaghetti</Box>

              <Stack direction="row" alignItems="center" spacing={2} className="cp-meta">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={4} readOnly />
                  <Box className="cp-rev">(324 reviews)</Box>
                </Stack>

                <Box className="cp-dot" />

                <Box className="cp-sub">Delizioso Restaurant • Seoul</Box>
              </Stack>

              <Box className="cp-desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.
                Tellus eu augue pretium, volutpat aliquam, donec.
              </Box>

              {/* OPTIONS (hard-coded UI) */}
              <Stack direction="row" spacing={2} className="cp-options">
                <TextField
                  size="small"
                  className="cp-note"
                  placeholder="Add a note (no onion, extra cheese...)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="cp-noteIcon">✎</Box>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box className="cp-tags">
                  <Box className="cp-tag">Italian</Box>
                  <Box className="cp-tag">Pasta</Box>
                  <Box className="cp-tag">Chef Special</Box>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* RIGHT: ORDER PANEL (STICKY) */}
          <Box className="cp-right">
            <Box className="cp-panel">
              <Box className="cp-panelTitle">Order Summary</Box>

              <Stack spacing={1.3} mt={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Box className="cp-priceLabel">Price</Box>
                  <Box className="cp-price">$12.05</Box>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box className="cp-priceLabel">Quantity</Box>

                  <Stack direction="row" spacing={1} alignItems="center" className="cp-qty">
                    <IconButton
                      className="cp-qtyBtn"
                      onClick={() => setQty((p) => (p > 1 ? p - 1 : 1))}
                    >
                      <RemoveRoundedIcon />
                    </IconButton>

                    <Box className="cp-qtyNum">{qty}</Box>

                    <IconButton className="cp-qtyBtn" onClick={() => setQty((p) => p + 1)}>
                      <AddRoundedIcon />
                    </IconButton>
                  </Stack>
                </Stack>

                <Box className="cp-line" />

                <Stack direction="row" justifyContent="space-between">
                  <Box className="cp-priceLabel">Subtotal</Box>
                  <Box className="cp-subtotal">${(12.05 * qty).toFixed(2)}</Box>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Box className="cp-priceLabel">Delivery</Box>
                  <Box className="cp-subtotal">$0.00</Box>
                </Stack>

                <Stack direction="row" justifyContent="space-between" className="cp-totalRow">
                  <Box className="cp-totalLabel">Total</Box>
                  <Box className="cp-total">${(12.05 * qty).toFixed(2)}</Box>
                </Stack>

                <Button variant="contained" color="secondary" className="cp-addBtn">
                  Add to Basket
                </Button>

                <Button variant="outlined" className="cp-wishBtn" startIcon={<FavoriteBorderRoundedIcon />}>
                  Add to wishlist
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default ChoosenProduct;
