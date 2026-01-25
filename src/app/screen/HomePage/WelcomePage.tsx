import React from "react";
import { Box, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../css/home.css";

function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="welcome-section">
      <Container className="welcome-container">
        <div className="welcome-grid">
          {/* LEFT IMAGES */}
          <div className="welcome-images">
            <img
              src="/imgs/welcomePage.png"
              alt="food"
              className="welcome-main-img"
            />
          </div>

          {/* RIGHT TEXT */}
          <div className="welcome-content">
            <Box className="welcome-title">Welcome to</Box>

            <Box className="welcome-brand">delizioso</Box>

            <Box className="welcome-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis
              ultrices at eleifend proin. Congue nibh nulla malesuada ultrices
              nec quam
            </Box>

            <Button
              variant="contained"
              color="secondary"
              className="welcome-btn"
              onClick={() => navigate("/products")}
            >
              See our menu
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default WelcomePage;
