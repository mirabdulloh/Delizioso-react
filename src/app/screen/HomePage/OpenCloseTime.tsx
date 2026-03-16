import React from "react";
import { Box, Stack, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sweetFailureProvider } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/home.css";

interface OpenCloseTimeProps {
  onLoginClick?: () => void;
}

function OpenCloseTime({ onLoginClick }: OpenCloseTimeProps = {}) {
  const navigate = useNavigate();
  const { authMember } = useGlobals();

  const handleOrderClick = () => {
    if (authMember) {
      navigate('/order-online');
    } else {
      sweetFailureProvider('Please login first to order.', true);
      onLoginClick?.();
    }
  };

  const handleReserveClick = () => {
    if (authMember) {
      navigate('/reservation');
    } else {
      sweetFailureProvider('Please login first to make a reservation.', true);
      onLoginClick?.();
    }
  };
  return (
    <div className="oct-section">
      <Container maxWidth="lg">

        <Box className="oct-card">

          {/* background */}
          <Box
            component="img"
            src="/imgs/open-close.png"
            className="oct-bg"
          />

          {/* overlay */}
          <Box className="oct-overlay" />

          {/* content */}
          <Stack
            className="oct-content"
            spacing={2.2}
            alignItems="center"
            justifyContent="center"
          >
            <Box className="oct-title">
              we are open from
            </Box>

            <Box className="oct-subtitle">
              Monday–Sunday
            </Box>

            <Stack spacing={0.7} className="oct-line">
              <Box className="oct-lines">Lunch : Mon-Sun : 11:00am-02:00pm</Box>
              <Box className="oct-lines">Dinner : Sunday : 04:00pm-08:00pm</Box>
              <Box className="oct-lines">04:00pm-09:00pm</Box>
            </Stack>

            {/* buttons */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 1.5, md: 3 }}
              className="oct-buttons"
              sx={{
                width: { xs: "100%", md: "fit-content" },
                maxWidth: "100%",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
              }}
            >
              {/* 🔥 theme secondary */}
              <Button
                variant="contained"
                color="secondary"
                size="large"
                className="open-btn"
                sx={{
                  width: { xs: "min(100%, 240px)", md: 232 },
                  maxWidth: "100%",
                  minHeight: { xs: 52, md: 56 },
                  px: { xs: 3, md: 4 },
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  whiteSpace: "nowrap",
                }}
                onClick={handleOrderClick}
              >
                Order now
              </Button>

              {/* 🔥 white */}
              <Button
                variant="contained"
                size="large"
                className="open-btn2"
                sx={{
                  width: { xs: "min(100%, 240px)", md: 232 },
                  maxWidth: "100%",
                  minHeight: { xs: 52, md: 56 },
                  px: { xs: 3, md: 4 },
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  whiteSpace: "nowrap",
                }}
                onClick={handleReserveClick}
              >
                Reservation
              </Button>
            </Stack>
          </Stack>
        </Box>

      </Container>
    </div>
  );
}

export default OpenCloseTime;
