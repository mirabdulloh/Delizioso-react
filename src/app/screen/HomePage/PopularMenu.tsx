import React from "react";
import {
  Container,
  Typography,
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

import "../../../css/home.css";

function PopularMenu() {
  return (
    <div className="popular-section">
      <Container>
        {/* TITLE */}
        <Box className="popular-title">Our popular menu</Box>

        {/* GRID */}
        <Stack className="menu-grid">
          {/* CARD 1 */}
          <Stack className="menu-card">
            <Box
              component="img"
              src="/imgs/header-img1.png"
              className="menu-img"
            />
            <Box className="menu-name">Ravioli</Box>
            <Box className="menu-stars">
              <Rating
                name="simple-controlled"
                value={4}
                //   onChange={(event, newValue) => {
                //     setValue(newValue);
                //   }}
              />
            </Box>
            <Box className="menu-desc">
              Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Cumque, beatae consequuntur dicta
              ipsa enim possimus velit quas sint incidunt, illo numquam neque
              magnam libero quo.
            </Box>

            <Stack direction="row" className="menu-footer">
              <Typography className="price">$12.05</Typography>
              <Button
                variant="contained"
                color="secondary"
                className="order-btn"
              >
                Order now
              </Button>
            </Stack>
          </Stack>

          {/* CARD 2 */}
          <Stack className="menu-card">
            <Box
              component="img"
              src="/imgs/header-img1.png"
              className="menu-img"
            />
            <Box className="menu-name">Ravioli</Box>
            <Box className="menu-stars">
              <Rating
                name="simple-controlled"
                value={4}
                //   onChange={(event, newValue) => {
                //     setValue(newValue);
                //   }}
              />
            </Box>
            <Box className="menu-desc">
              Lorem ipsum dolor sit amet consectetur
            </Box>

            <Stack direction="row" className="menu-footer">
              <Typography className="price">$12.05</Typography>
              <Button
                variant="contained"
                color="secondary"
                className="order-btn"
              >
                Order now
              </Button>
            </Stack>
          </Stack>

          {/* CARD 3 */}
          <Stack className="menu-card">
            <Box
              component="img"
              src="/imgs/header-img1.png"
              className="menu-img"
            />
            <Box className="menu-name">Ravioli</Box>
            <Box className="menu-stars">
              <Rating
                name="simple-controlled"
                value={4}
                //   onChange={(event, newValue) => {
                //     setValue(newValue);
                //   }}
              />
            </Box>
            <Box className="menu-desc">
              Lorem ipsum dolor sit amet consectetur
            </Box>

            <Stack direction="row" className="menu-footer">
              <Typography className="price">$12.05</Typography>
              <Button
                variant="contained"
                color="secondary"
                className="order-btn"
              >
                Order now
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Stack className="pagination-wrap" direction="row" alignItems="center">
          <IconButton
            className="pg-arrow"
            // disabled={page <= 1}
            // onClick={() => onChange(page - 1)}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>

          <Pagination
            page={1}
            count={5}
            // onChange={(_, p) => onChange(p)}
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
            // disabled={100 >= 8}
            // onClick={() => onChange(page + 1)}
          >
            <ArrowForwardIosRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Container>
    </div>
  );
}

export default PopularMenu;
