import React, { useState } from "react";
import {
  Container,
  Stack,
  Box,
  Button,
  Rating,
  IconButton,
  Pagination,
  PaginationItem,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import { retrievePopularDishes, retrievePaginationInfo } from "./selector";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";

import "../../../css/home.css";

interface PopularMenuProps {
  page: number;
  setPage: (page: number) => void;
  onAdd: (item: CartItem) => void;
}

function PopularMenu({ page, setPage, onAdd }: PopularMenuProps) {
  const popularDishes = useSelector(retrievePopularDishes);
  const { totalPages } = useSelector(retrievePaginationInfo);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedItemName, setAddedItemName] = useState("");
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  
  console.log("[PopularMenu] popularDishes from selector:", popularDishes);
  console.log("[PopularMenu] Current page:", page, "Total pages:", totalPages);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    console.log("[PopularMenu] Page changed to:", value);
    if (value <= totalPages) {
      setPage(value);
    }
  };

  const handleAddToCart = (dish: any) => {
    const cartItem: CartItem = {
      _id: dish._id,
      quantity: 1,
      name: dish.productName,
      price: dish.productPrice,
      image: dish.productImages[0],
    };
    onAdd(cartItem);
    setAddedItemName(dish.productName);
    setSnackbarOpen(true);
    setClickedButton(dish._id);
    
    // Remove button animation after 600ms
    setTimeout(() => {
      setClickedButton(null);
    }, 600);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="popular-section">
      <Container>
        {/* TITLE */}
        <Box className="popular-title">Our popular menu</Box>

        {/* GRID */}
        <Stack className="menu-grid">
          {popularDishes.map((dish) => (
            <Stack key={dish._id} className="menu-card" spacing={1.5}>
              <Box
                component="img"
                src={`${serverApi}/${dish.productImages[0]}`}
                className="menu-img"
              />
              <Box className="menu-name">{dish.productName}</Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box className="menu-stars" sx={{ mt: "2px" }}>
                  <Rating 
                    name="read-only" 
                    value={dish.productRank || 0} 
                    readOnly 
                    size="large"
                  />
                </Box>
                <Box sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#666",
                  backgroundColor: "#f5f5f5",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                }}>
                  ({dish.productReviewCount || 0} reviews)
                </Box>
              </Stack>
              <Box className="menu-desc">
                {dish.productDesc || "Delicious dish prepared with love"}
              </Box>

              <Stack direction="row" className="menu-footer">
                <Box className="price">${dish.productPrice.toFixed(2)}</Box>
                <Button
                  variant="contained"
                  color="secondary"
                  className="order-btn"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(dish)}
                  sx={{
                    transition: "all 0.3s ease",
                    transform: clickedButton === dish._id ? "scale(0.95)" : "scale(1)",
                    "&:active": {
                      transform: "scale(0.95)",
                    },
                  }}
                >
                  {clickedButton === dish._id ? "Added!" : "Order now"}
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Stack className="pagination-wrap" direction="row" alignItems="center">
          <IconButton
            className="pg-arrow"
            disabled={page <= 1}
            onClick={handlePreviousPage}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>

          <Pagination
            page={page}
            count={totalPages || 1}
            onChange={handlePageChange}
            siblingCount={1}
            boundaryCount={1}
            hidePrevButton
            hideNextButton
            renderItem={(item) => (
              <PaginationItem
                {...item}
                className={`pg-item ${item.selected ? "is-active" : ""}`}
              />
            )}
          />

          <IconButton
            className="pg-arrow"
            disabled={page >= totalPages}
            onClick={handleNextPage}
          >
            <ArrowForwardIosRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Container>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            "& .MuiAlert-icon": {
              fontSize: 28,
            },
          }}
        >
          <strong>{addedItemName}</strong> added to cart!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PopularMenu;
