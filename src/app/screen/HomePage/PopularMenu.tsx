import React from "react";
import {
  Container,
  Stack,
  Box,
  Button,
  Rating,
  IconButton,
  Pagination,
  PaginationItem,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useSelector } from "react-redux";
import { retrievePopularDishes, retrievePaginationInfo } from "./selector";
import { serverApi } from "../../../lib/config";

import "../../../css/home.css";

interface PopularMenuProps {
  page: number;
  setPage: (page: number) => void;
}

function PopularMenu({ page, setPage }: PopularMenuProps) {
  const popularDishes = useSelector(retrievePopularDishes);
  const { totalPages } = useSelector(retrievePaginationInfo);
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

  return (
    <div className="popular-section">
      <Container>
        {/* TITLE */}
        <Box className="popular-title">Our popular menu</Box>

        {/* GRID */}
        <Stack className="menu-grid">
          {popularDishes.map((dish) => (
            <Stack key={dish._id} className="menu-card">
              <Box
                component="img"
                src={`${serverApi}/${dish.productImages[0]}`}
                className="menu-img"
              />
              <Box className="menu-name">{dish.productName}</Box>
              <Box className="menu-stars">
                <Rating 
                  name="read-only" 
                  value={dish.productRank || 0} 
                  readOnly 
                />
              </Box>
              <Box className="menu-desc">
                {dish.productDesc || "Delicious dish prepared with love"}
              </Box>

              <Stack direction="row" className="menu-footer">
                <Box className="price">${dish.productPrice.toFixed(2)}</Box>
                <Button
                  variant="contained"
                  color="secondary"
                  className="order-btn"
                >
                  Order now
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
    </div>
  );
}

export default PopularMenu;
