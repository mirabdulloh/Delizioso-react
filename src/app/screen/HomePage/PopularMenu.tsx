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
import { serverApi, Messages } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

import "../../../css/home.css";

interface PopularMenuProps {
  page: number;
  setPage: (page: number) => void;
  onAdd: (item: CartItem) => void;
}

function PopularMenu({ page, setPage, onAdd }: PopularMenuProps) {
  const popularDishes = useSelector(retrievePopularDishes);
  const { totalPages } = useSelector(retrievePaginationInfo);
  const { authMember } = useGlobals();
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
    if (!authMember) {
      sweetErrorHandling({ message: "Please sign up first" });
      return;
    }
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
        <div className="menu-grid menu-grid-4">
          {popularDishes.map((dish) => (
            <div key={dish._id} className="menu-card menu-card-small">
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={`${serverApi}/${dish.productImages[0]}`}
                  className="menu-img menu-img-small"
                />
                <Box className="menu-views-topright">
                  <svg
                    style={{ marginRight: 2, verticalAlign: "middle" }}
                    width="18"
                    height="18"
                    fill="#888"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5c-7.633 0-11 6.5-11 7s3.367 7 11 7 11-6.5 11-7-3.367-7-11-7zm0 12c-5.177 0-8.241-3.93-9.05-5 .809-1.07 3.873-5 9.05-5s8.241 3.93 9.05 5c-.809 1.07-3.873 5-9.05 5zm0-8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 4c-.552 0-1-.449-1-1s.448-1 1-1 1 .449 1 1-.448 1-1 1z" />
                  </svg>
                  {dish.productViews}
                </Box>
              </Box>
              <Box className="menu-name menu-name-small">
                {dish.productName}
              </Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                justifyContent="center"
              >
                <Box className="menu-stars" sx={{ mt: "2px" }}>
               
                  <Rating
                    name={`rating-${dish._id}`}
                    value={Number(dish.productRank) || 0}
                    readOnly
                    size="medium"
                  />
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#666",
                    backgroundColor: "#f5f5f5",
                    px: 1,
                    py: 0.25,
                    borderRadius: "8px",
                  }}
                >
                  ({dish.productReviewCount || 0} reviews)
                </Box>
              </Stack>
              <Box className="menu-desc menu-desc-small">
                {dish.productDesc || "Delicious dish prepared with love"}
              </Box>
              <Stack direction="row" className="menu-footer menu-footer-small">
                <Box className="price price-small">
                  ₩{dish.productPrice.toFixed(2)}
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  className="order-btn order-btn-small"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(dish)}
                  sx={{
                    transition: "all 0.3s ease",
                    transform:
                      clickedButton === dish._id ? "scale(0.95)" : "scale(1)",
                    "&:active": {
                      transform: "scale(0.95)",
                    },
                  }}
                >
                  {clickedButton === dish._id ? "Added!" : "Order now"}
                </Button>
              </Stack>
            </div>
          ))}
        </div>

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
