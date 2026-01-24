import React from "react";
import { Box, Container } from "@mui/material";
import "../../../css/home.css";

function CostumerReviews() {
  return (
    <Box className="review-section">
      <Container className="review-container">
        {/* TITLE */}
        <Box component="h1" className="review-title">
          Our customers say
        </Box>

        {/* MAIN REVIEW */}
        <Box className="review-main">
          {/* MAIN FOOD/USER IMAGE */}
          <Box className="review-main-ring">
            <Box className="review-main-ring2">
              <Box
                component="img"
                src="/imgs/header-img1.png"
                className="review-main-img"
                alt="Food"
              />
            </Box>
          </Box>

          <Box className="review-name">Starla Virgoun</Box>
          <Box className="review-role">Financial advisor</Box>

          <Box className="review-quote">
            <Box className="review-quote-mark left">“</Box>
            <Box component="p" className="review-quote-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis
              ultricies at eleifend proin. Congue nibh nulla malesuada ultrices
              nec quam.
            </Box>
            <Box className="review-quote-mark right">”</Box>
          </Box>
        </Box>

        {/* USERS ROW */}
        <Box className="review-users-row">
          {/* user 1 */}
          <Box className="review-user-ring">
            <Box className="review-user-ring2">
              <Box
                component="img"
                src="/imgs/u1.png"
                className="rdefault_img.jpg"
                alt="User 1"
              />
            </Box>
          </Box>

          {/* user 2 */}
          <Box className="review-user-ring">
            <Box className="review-user-ring2">
              <Box
                component="img"
                src="/imgs/default_img.jpg"
                className="review-user-img"
                alt="User 2"
              />
            </Box>
          </Box>

          {/* active user (bigger) */}
          <Box className="review-user-ring active">
            <Box className="review-user-ring2 active">
              <Box
                component="img"
                src="/imgs/default_img.jpg"
                className="review-user-img active"
                alt="Active user"
              />
            </Box>
          </Box>

          {/* user 3 */}
          <Box className="review-user-ring">
            <Box className="review-user-ring2">
              <Box
                component="img"
                src="/imgs/default_img.jpg"
                className="review-user-img"
                alt="User 3"
              />
            </Box>
          </Box>

          {/* user 4 */}
          <Box className="review-user-ring">
            <Box className="review-user-ring2">
              <Box
                component="img"
                src="/imgs/default_img.jpg"
                className="review-user-img"
                alt="User 4"
              />
            </Box>
          </Box>
        </Box>

        {/* DECOR DOTS */}
        <Box className="review-dot dot-1" />
        <Box className="review-dot dot-2" />
        <Box className="review-dot dot-3" />
        <Box className="review-dot dot-4" />
        <Box className="review-dot dot-5" />
      </Container>
    </Box>
  );
}

export default CostumerReviews;
