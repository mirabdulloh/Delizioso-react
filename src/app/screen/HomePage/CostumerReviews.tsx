import React, { useEffect, useState } from "react";
import { Box, Container, Rating } from "@mui/material";
import ReviewService, { Review } from "../../services/ReviewService";
import { serverApi } from "../../../lib/config";
import "../../../css/home.css";

function CostumerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewService = new ReviewService();
        const data = await reviewService.getTopReviews(5);
        if (data && data.length > 0) {
          setReviews(data);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) {
    return null;
  }

  const activeReview = reviews[activeIndex];
  const memberImage = activeReview.memberId?.memberImage
    ? `${serverApi}/${activeReview.memberId.memberImage}`
    : "/imgs/default_img.jpg";
  const productImage = activeReview.productId?.productImages?.[0]
    ? `${serverApi}/${activeReview.productId.productImages[0]}`
    : "/imgs/chef1.png";

  return (
    <div className="review-section">
      <Container className="review-container">
        <Box className="review-main">
          <Box className="review-title">Our customers say</Box>

          <Box className="review-image-box">
            <img
              src={productImage}
              alt={activeReview.productId?.productName || "Food"}
              className="review-food-img"
            />
          </Box>

          <Box className="review-name">
            {activeReview.memberId?.memberNick || "Anonymous"}
          </Box>

          <Box className="review-rating">
            <Rating value={activeReview.rating} readOnly />
          </Box>

          <Box className="review-quote">
            “{activeReview.comment || "Great food and service!"}”
          </Box>

          {activeReview.productId?.productName && (
            <Box className="review-product-name">
              {activeReview.productId.productName}
            </Box>
          )}
        </Box>

        <Box className="review-users-row">
          {reviews.map((review, index) => {
            const userImg = review.memberId?.memberImage
              ? `${serverApi}/${review.memberId.memberImage}`
              : "/imgs/default_img.jpg";

            return (
              <Box
                key={review._id}
                className={`review-user ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
                style={{ cursor: "pointer" }}
              >
                <img src={userImg} alt={review.memberId?.memberNick || "User"} />
              </Box>
            );
          })}
        </Box>
      </Container>
    </div>
  );
}

export default CostumerReviews;
