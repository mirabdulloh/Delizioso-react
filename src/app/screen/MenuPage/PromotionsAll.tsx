// PromotionsAll.jsx
import React from "react";
import {
  Box,
  Stack,
  Container,
  Button,
  Rating,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";



import "../../../css/menu.css";
import OrderList from "./OrderList";

function PromotionsAll() {
  // ✅ HARD CODE: false = 4 cards, true = 3 cards + order list
  const cartOpen = false;

  // ✅ HARD CODE items
  const promoItems = [
    {
      id: 1,
      name: "Creamy Gnocchi",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 112,
      oldPrice: 18.0,
      newPrice: 12.6,
      off: 30,
      likes: 98,
      views: 1200,
      desc: "Limited time deal. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      selected: false,
      tag: "Lunch Deal",
    },
    {
      id: 2,
      name: "Truffle Pasta",
      image: "/imgs/pastas.jpg",
      rating: 5,
      reviews: 540,
      oldPrice: 20.0,
      newPrice: 13.0,
      off: 35,
      likes: 305,
      views: 5400,
      desc: "Best seller promo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      selected: false,
      tag: "Best Seller",
    },
    {
      id: 3,
      name: "Signature Pizza",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 86,
      oldPrice: 24.0,
      newPrice: 13.2,
      off: 45,
      likes: 76,
      views: 980,
      desc: "Hot deal today. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      selected: false,
      tag: "Hot Deal",
    },
    {
      id: 4,
      name: "Pasta Special",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 210,
      oldPrice: 16.0,
      newPrice: 11.2,
      off: 30,
      likes: 211,
      views: 2300,
      desc: "Limited time • Free drink",
      selected: false,
      tag: "Limited",
    },
    {
      id: 5,
      name: "Family Combo",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 64,
      oldPrice: 30.0,
      newPrice: 19.9,
      off: 33,
      likes: 64,
      views: 860,
      desc: "Limited time • Best value",
      selected: false,
      tag: "Combo",
    },
    {
      id: 6,
      name: "Chef Pasta",
      image: "/imgs/pastas.jpg",
      rating: 5,
      reviews: 324,
      oldPrice: 22.0,
      newPrice: 14.9,
      off: 32,
      likes: 124,
      views: 1800,
      desc: "Chef special discount",
      selected: false,
      tag: "Chef",
    },
  ];

  return (
    <Box className="promoAll-section">
      <Container maxWidth={false} className="promoAll-container">
        {/* title */}
        <Box className="promoAll-title">Hot Promotions</Box>
        <Box className="promoAll-subtitle">
          Discounts 30%+ • Limited time deals
        </Box>

        {/* search */}
        <Box className="promoAll-topbar">
          <TextField
            className="promoAll-search"
            placeholder="Search promotions..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

 

        {/* layout */}
        <Box
          className={`promoAll-layout ${cartOpen ? "with-cart" : "no-cart"}`}
        >
          {/* LEFT */}
          <Box className="promoAll-left">
            <Box className={`promoAll-grid ${cartOpen ? "cols-3" : "cols-4"}`}>
              {promoItems.map((item) => (
                <Box
                  key={item.id}
                  className={`promoAll-card ${item.selected ? "selected" : ""}`}
                  role="button"
                >
                  {/* % off + tag */}
                  <Box className="promoAll-badges">
                    <Box className="promoAll-off">-{item.off}%</Box>
                    
                  </Box>

                  {/* likes / views */}
                  <Box className="promoAll-icons">
                    <Box className="promoAll-pill">
                      <FavoriteBorderRoundedIcon />
                      <span>{item.likes}</span>
                    </Box>
                    
                  </Box>

                  {/* image */}
                  <Box className="promoAll-imgWrap">
                    <Box component="img" src={item.image} alt={item.name} />
                  </Box>

                  {/* name */}
                  <Box className="promoAll-name">{item.name}</Box>

                  {/* rating */}
                  <Box className="promoAll-rating">
                    <Rating value={item.rating} readOnly />
                    <span className="promoAll-rev">({item.reviews})</span>
                  </Box>

                  {/* desc */}
                  <Box className="promoAll-desc">{item.desc}</Box>

                  {/* prices + button */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="promoAll-foot"
                  >
                    <Box className="promoAll-price">
                      <span className="promoAll-old">
                        ${item.oldPrice.toFixed(2)}
                      </span>
                      <span className="promoAll-new">
                        ${item.newPrice.toFixed(2)}
                      </span>
                    </Box>

                    <Button
                      variant="contained"
                      color="secondary"
                      className="promoAll-order"
                    >
                      Order
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>

          {/* RIGHT */}
          {cartOpen ? <OrderList /> : null}
        </Box>
      </Container>
    </Box>
  );
}

export default PromotionsAll;
