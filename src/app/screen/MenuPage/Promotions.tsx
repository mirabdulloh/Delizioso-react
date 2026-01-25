import React from "react";
import { Box, Stack, Button, Chip, Container } from "@mui/material";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import "../../../css/menu.css";
import HomePage from "../HomePage";
import { useNavigate } from "react-router-dom";
import PromotionsAll from "./PromotionsAll";

function Promotions() {
  const navigate = useNavigate();
  return (
    <div className="promotions">
      <Box className="promo2">
        <Container>
          {/* header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="promo2-head"
          >
            <Stack spacing={0.5}>
              <Box className="promo2-title">Hot Promotions</Box>
              <Box className="promo2-sub">
                Discounts 30%+ • Limited time deals
              </Box>
            </Stack>

            <Button
              className="promo2-viewAll"
              variant="text"
              onClick={() => navigate("/promotions")}
            >
              View all
            </Button>
          </Stack>

          {/* big banner + side cards */}
          <Box className="promo2-grid">
            {/* BIG HERO */}
            <Box className="promo2-hero">
              <Box className="promo2-hero-bg" />

              <Box className="promo2-hero-overlay" />

              <Box className="promo2-hero-content">
                <Stack direction="row" spacing={1} className="promo2-badges">
                  <Chip
                    icon={<LocalFireDepartmentRoundedIcon />}
                    label="Hot Deal"
                    className="promo2-chip promo2-chip-hot"
                  />
                  <Chip
                    icon={<AccessTimeRoundedIcon />}
                    label="Ends Today"
                    className="promo2-chip promo2-chip-time"
                  />
                </Stack>

                <Box className="promo2-hero-h1">Up to 45% OFF</Box>
                <Box className="promo2-hero-h2">Signature Pasta & Pizza</Box>

                <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                  <Box className="promo2-priceRow">
                    <Box className="promo2-old">$24.00</Box>
                    <Box className="promo2-new">$13.20</Box>
                  </Box>

                  <Box className="promo2-off">-45%</Box>
                </Stack>

                <Stack direction="row" spacing={1.5} mt={7}>
                  <Button
                    variant="contained"
                    color="secondary"
                    className="promo2-btn"
                  >
                    Order now
                  </Button>
                  <Button variant="outlined" className="promo2-btnGhost">
                    Details
                  </Button>
                </Stack>
              </Box>

              {/* hero image */}
              <Box
                component="img"
                src="/imgs/pastas.jpg"
                alt="Promo food"
                className="promo2-hero-img"
              />
            </Box>

            {/* RIGHT SMALL CARDS */}
            <Stack spacing={2} className="promo2-side">
              <Box className="promo2-mini">
                <Box className="promo2-mini-top">
                  <Box className="promo2-mini-off">-30%</Box>
                  <Box className="promo2-mini-tag">Lunch Deal</Box>
                </Box>

                <Box className="promo2-mini-name">Creamy Gnocchi</Box>

                <Stack direction="row" spacing={1} alignItems="baseline" mt={1}>
                  <Box className="promo2-mini-old">$18.00</Box>
                  <Box className="promo2-mini-new">$12.60</Box>
                </Stack>

                <Button
                  variant="contained"
                  color="secondary"
                  className="promo2-mini-btn"
                >
                  Order
                </Button>

                <Box
                  component="img"
                  src="/imgs/pastas.jpg"
                  alt="Gnocchi"
                  className="promo2-mini-img"
                />
              </Box>

              <Box className="promo2-mini promo2-mini-dark">
                <Box className="promo2-mini-top">
                  <Box className="promo2-mini-off">-30%</Box>
                  <Box className="promo2-mini-tag">Best Seller</Box>
                </Box>

                <Box className="promo2-mini-name">Truffle Pasta</Box>

                <Stack direction="row" spacing={1} alignItems="baseline" mt={1}>
                  <Box className="promo2-mini-old">$20.00</Box>
                  <Box className="promo2-mini-new">$13.00</Box>
                </Stack>

                <Button
                  variant="contained"
                  color="secondary"
                  className="promo2-mini-btn"
                >
                  Order
                </Button>

                <Box
                  component="img"
                  src="/imgs/pastas.jpg"
                  alt="Truffle Pasta"
                  className="promo2-mini-img"
                />
              </Box>
            </Stack>
          </Box>

          {/* horizontal scroll deals */}
          <Box className="promo2-strip">
            <Box className="promo2-strip-title">More 30%+ deals</Box>

            {/* viewport */}
            <Box className="promo2-marquee">
              {/* moving track */}
              <Box className="promo2-track">
                {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((i, idx) => (
                  <Box key={idx} className="promo2-dealCard">
                    <Box className="promo2-dealOff">-30%</Box>
                    <Box className="promo2-dealName">Pasta Special</Box>
                    <Box className="promo2-dealDesc">
                      Limited time • Free drink
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="baseline"
                      mt={1}
                    >
                      <Box className="promo2-dealOld">$16.00</Box>
                      <Box className="promo2-dealNew">$11.20</Box>
                    </Stack>

                    <Button
                      variant="contained"
                      color="secondary"
                      className="promo2-dealBtn"
                    >
                      Order
                    </Button>

                    <Box
                      component="img"
                      src="/imgs/pastas.jpg"
                      alt="Deal"
                      className="promo2-dealImg"
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}

export default Promotions;
