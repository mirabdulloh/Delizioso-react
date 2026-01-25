import React from "react";
import { Box, Stack, Button, Container, Typography } from "@mui/material";
import "../../../css/home.css";

function OpenCloseTime() {
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
            <Stack direction="row" spacing={3} className="oct-buttons">
              {/* 🔥 theme secondary */}
              <Button
                variant="contained"
                color="secondary"
                size="large"
                className="open-btn"
              >
                Order now
              </Button>

              {/* 🔥 white */}
              <Button
                variant="contained"
                size="large"
                className="open-btn2"
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
