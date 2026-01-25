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
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";


import "../../../css/menu.css";
import OrderList from "./OrderList";

const Menu = () => {
  // ✅ HARD-CODE: change to true when you want to show cart
  const cartOpen = true; // false = 4 cards, true = 3 cards + cart

  const categories = [
    "All Category",
    "Dinner",
    "Lunch",
    "Dessert",
    "Drink",
    "Favorite",
  ];

  const menuItems = [
    {
      id: 1,
      name: "Spaghetti",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 324,
      price: 12.05,
      likes: 124,
      views: 1800,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      selected: false,
    },
    {
      id: 2,
      name: "Linguine",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 112,
      price: 12.05,
      likes: 98,
      views: 1200,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      selected: false,
    },
    {
      id: 3,
      name: "Capellini",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 86,
      price: 12.05,
      likes: 76,
      views: 980,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      selected: false,
    },
    {
      id: 4,
      name: "Fettuccine",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 210,
      price: 12.05,
      likes: 211,
      views: 2300,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      selected: false,
    },
    {
      id: 5,
      name: "Bucatini",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 64,
      price: 12.05,
      likes: 64,
      views: 860,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      selected: false,
    },
    {
      id: 6,
      name: "Tortellini",
      image: "/imgs/pastas.jpg",
      rating: 4,
      reviews: 540,
      price: 12.05,
      likes: 305,
      views: 5400,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas consequat mi eget auctor aliquam, diam.",
      selected: false,
    },
  ];

  return (
    <div className="menu2-section">
      <Container>
        <Box className="menu2-title">Menu</Box>

        {/* search left under title */}
        <Box className="menu2-topbar">
          <TextField
            className="menu2-search"
            placeholder="Search your favorite food..."
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

        {/* categories (full-width under search) */}
        <Stack
          direction="row"
          spacing={2}
          className="menu2-cats"
          flexWrap="wrap"
        >
          {categories.map((c) => (
            <Button
              key={c}
              className={`menu2-cat ${c === "All Category" ? "active" : ""}`}
            >
              {c}
            </Button>
          ))}
        </Stack>

        {/* layout changes by cartOpen */}
        <Box className={`menu2-layout ${cartOpen ? "with-cart" : "no-cart"}`}>
          {/* LEFT */}
          <Box className="menu2-left">
            {/* grid changes: 4 cols when no cart, 3 cols when cart */}
            <Box className={`menu2-grid ${cartOpen ? "cols-3" : "cols-4"}`}>
              {menuItems.map((item) => (
                <Box
                  key={item.id}
                  className={`menu2-card ${item.selected ? "selected" : ""}`}
                  role="button"
                >
                  {/* icons */}
                  <Box className="menu2-icons">
                    <Box className="menu2-pill">
                      <FavoriteBorderRoundedIcon />
                      <span>{item.likes}</span>
                    </Box>
                    <Box className="menu2-pill">
                      <VisibilityOutlinedIcon />
                      <span>{item.views}</span>
                    </Box>
                  </Box>

                  <Box className="menu2-imgWrap">
                    <Box component="img" src={item.image} alt={item.name} />
                  </Box>

                  <Box className="menu2-name">{item.name}</Box>

                  <Box className="menu2-rating">
                    <Rating value={item.rating} readOnly />
                    <span className="menu2-rev">({item.reviews})</span>
                  </Box>

                  <Box className="menu2-desc">{item.description}</Box>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="menu2-foot"
                  >
                    <Box className="menu2-price">${item.price.toFixed(2)}</Box>

                    <Button
                      variant="contained"
                      color="secondary"
                      className="menu2-order"
                    >
                      Order now
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>

          {/* RIGHT: only render if cartOpen */}
          {cartOpen ? <OrderList /> : null}
        </Box>
      </Container>
    </div>
  );
};

export default Menu;
