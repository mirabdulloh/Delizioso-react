import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import { sweetErrorHandling, sweetSuccessAlert } from "../../lib/sweetAlert";
import ReviewService from "../services/ReviewService";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  onSuccess?: () => void;
}

const labels: { [index: string]: string } = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

function ReviewModal({
  open,
  onClose,
  orderId,
  productId,
  productName,
  productImage,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hover, setHover] = useState(-1);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      sweetErrorHandling({ message: "Please select a rating" });
      return;
    }

    try {
      setSubmitting(true);
      const reviewService = new ReviewService();
      await reviewService.createReview({
        orderId,
        productId,
        rating,
        comment: comment.trim() || undefined,
      });

      await sweetSuccessAlert("Success", "Your review has been submitted!");
      setRating(5);
      setComment("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Error submitting review:", err);
      sweetErrorHandling(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setRating(5);
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Write a Review</Typography>
          <IconButton onClick={handleClose} disabled={submitting} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Product Info */}
          <Stack direction="row" spacing={2} alignItems="center">
            {productImage && (
              <Box
                component="img"
                src={productImage}
                alt={productName}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0",
                }}
              />
            )}
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {productName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                How was your experience with this item?
              </Typography>
            </Box>
          </Stack>

          {/* Rating */}
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Rating
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating
                name="product-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue || 0);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                size="large"
                emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
              {rating !== null && (
                <Typography variant="body2" color="text.secondary" ml={2}>
                  {labels[hover !== -1 ? hover : rating]}
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Comment */}
          <Box>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Your Review (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Share your thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              inputProps={{ maxLength: 2000 }}
              helperText={`${comment.length}/2000 characters`}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={submitting} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || rating === 0}
          color="primary"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReviewModal;
