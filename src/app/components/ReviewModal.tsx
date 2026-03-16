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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

      // Reset form and close modal first
      setRating(5);
      setComment("");
      setSubmitting(false);
      onClose();
      
      // Call onSuccess callback to refresh the order list
      if (onSuccess) onSuccess();
      
      // Show success message after modal closes
      setTimeout(() => {
        sweetSuccessAlert("Success", "Your review has been submitted!");
      }, 300);
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setSubmitting(false);
      sweetErrorHandling(err);
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          m: { xs: 0, sm: 2 },
          width: { xs: "100%", sm: "min(100%, 600px)" },
          maxWidth: { xs: "100%", sm: "calc(100vw - 32px)" },
          borderRadius: { xs: 0, sm: 3 },
        },
      }}
    >
      <DialogTitle sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Write a Review</Typography>
          <IconButton onClick={handleClose} disabled={submitting} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 1, sm: 2 } }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Product Info */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            {productImage && (
              <Box
                component="img"
                src={productImage}
                alt={productName}
                sx={{
                  width: { xs: 72, sm: 60 },
                  height: { xs: 72, sm: 60 },
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: { xs: 0, sm: 2 } }}
                >
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
              rows={isMobile ? 5 : 4}
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

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 2.5 },
          gap: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          onClick={handleClose}
          disabled={submitting}
          color="inherit"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || rating === 0}
          color="primary"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReviewModal;
