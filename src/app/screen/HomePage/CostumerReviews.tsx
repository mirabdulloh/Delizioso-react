import React from "react";
import { Box, Container } from "@mui/material";
import "../../../css/home.css";

function CostumerReviews() {
  return (
    <div className="review-section">
      <Container className="review-container">

        {/* TITLE */}
       

        {/* ================= MAIN REVIEW ================= */}
        <Box className="review-main">
        <Box component="h1" className="review-title">
          Our customers say
        </Box>

          {/* 🔥 SQUARE FOOD CARD (NOT CIRCLE ANYMORE) */}
          <Box className="review-food-card">
            <img
              src="/imgs/chef1.png"
              alt="Food"
              className="review-food-img"
            />
          </Box>

          <Box className="review-name">Starla Virgoun</Box>

          <Box className="review-quote">
            <span className="quote-left">“</span>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis
              ultricies at eleifend proin. Congue nibh nulla malesuada ultrices
              nec quam.
            </p>

            <span className="quote-right">”</span>
          </Box>
        </Box>

        {/* ================= USERS ROW ================= */}
        <Box className="review-users-row">

          {/* small */}
          <Box className="review-user">
            <img src="/imgs/default_img.jpg" alt="" />
          </Box>

          {/* small */}
          <Box className="review-user">
            <img src="/imgs/default_img.jpg" alt="" />
          </Box>

          {/* 🔥 ACTIVE (bigger) */}
          <Box className="review-user active">
            <img src="/imgs/default_img.jpg" alt="" />
          </Box>

          {/* small */}
          <Box className="review-user">
            <img src="/imgs/default_img.jpg" alt="" />
          </Box>

          {/* small */}
          <Box className="review-user">
            <img src="/imgs/default_img.jpg" alt="" />
          </Box>

        </Box>

      </Container>
    </div>
  );
}

export default CostumerReviews;
