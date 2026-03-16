import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Button,
  Rating,
  Divider,
  Typography,
  Dialog,
  TextField,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import ReviewService from "../../services/ReviewService";
import { serverApi } from "../../../lib/config";
import { EditingReview } from "../../../lib/types/mypage";
import {
  sweetErrorHandling,
  sweetSuccessAlert,
  sweetWarningAlert,
} from "../../../lib/sweetAlert";
import { fetchMyReviews, updateReviewInState } from "./slice";
import { selectMyReviews, selectLoadingReviews } from "./selector";
import { AppDispatch } from "../../store";
import "../../../css/my-reviews.css";

function MyReviews() {
  const dispatch = useDispatch<AppDispatch>();
  const reviews = useSelector(selectMyReviews) as EditingReview[];
  const loading = useSelector(selectLoadingReviews);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempRating, setTempRating] = useState<number>(5);
  const [tempComment, setTempComment] = useState<string>("");

  useEffect(() => {
    dispatch(fetchMyReviews());
  }, [dispatch]);

  const isEditable = (review: EditingReview): boolean => {
    if (!review.editableUntil) return false;
    const now = Date.now();
    const until = new Date(review.editableUntil).getTime();
    return now <= until;
  };

  const getRemainingEditDays = (review: EditingReview): number => {
    if (!review.editableUntil) return 0;
    const now = Date.now();
    const until = new Date(review.editableUntil).getTime();
    const daysRemaining = Math.ceil((until - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
  };

  const handleEditClick = (review: EditingReview) => {
    if (!isEditable(review)) {
      sweetWarningAlert(
        "Edit Time Expired",
        `You can only edit reviews within 3 days of creation. This review is no longer editable.`
      );
      return;
    }

    // Initialize temp values for the dialog
    setTempRating(review.rating);
    setTempComment(review.comment || "");
    setEditingId(review._id);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    const editingReview = reviews.find((r) => r._id === editingId);
    if (!editingReview) return;

    setIsSubmitting(true);

    try {
      const reviewService = new ReviewService();

      // Make sure we have valid data
      const updatePayload = {
        reviewId: editingId,
        rating: tempRating,
        comment: tempComment,
      };

      console.log("Updating review with payload:", updatePayload);
      const updatedReview = await reviewService.updateReview(updatePayload);
      console.log("Review updated successfully:", updatedReview);

      // Update Redux state with the updated review
      dispatch(updateReviewInState(updatedReview as any));

      setEditDialogOpen(false);
      setEditingId(null);
      setIsSubmitting(false);
      await sweetSuccessAlert(
        "Review Updated",
        "Your review has been updated successfully."
      );
    } catch (err) {
      console.error("Failed to update review:", err);
      setIsSubmitting(false);
      await sweetErrorHandling(err);
    }
  };

  if (loading) {
    return (
      <Box className="my-reviews-loading">
        <Typography>Loading your reviews...</Typography>
      </Box>
    );
  }

  if (reviews.length === 0) {
    return (
      <Box className="my-reviews-empty">
        <InboxRoundedIcon className="empty-icon" />
        <Typography variant="h6" className="empty-title">
          No reviews yet
        </Typography>
        <Typography variant="body2" className="empty-text">
          Start writing reviews for items you've ordered
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="my-reviews-container">
      <Typography variant="h5" className="reviews-title">
        My Reviews
      </Typography>
      <Typography variant="body2" className="reviews-subtitle">
        Reviews you've written for your orders
      </Typography>

      <Stack spacing={2} className="reviews-list">
        {reviews.map((review) => {
          const editable = isEditable(review);
          const remainingDays = getRemainingEditDays(review);

          return (
            <Box key={review._id} className="review-card">
              {/* Review Header */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
                justifyContent="space-between"
                className="review-header"
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                  sx={{ flex: 1 }}
                  className="review-header-main"
                >
                  {/* Product Image */}
                  <Box
                    component="img"
                    src={
                      review.productId?.productImages?.[0]
                        ? `${serverApi}/${review.productId.productImages[0]}`
                        : "/imgs/pastas.jpg"
                    }
                    alt={review.productId?.productName}
                    className="review-product-img"
                  />

                  {/* Product Info */}
                  <Box className="review-product-info">
                    <Typography className="product-name">
                      {review.productId?.productName || "Unknown Product"}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="caption" className="rating-text">
                        {review.rating}/5
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* Edit Status Badge */}
                {editable && remainingDays > 0 && (
                  <Chip
                    label={`Edit in ${remainingDays}d`}
                    size="small"
                    color="info"
                    variant="outlined"
                    className="editable-chip"
                  />
                )}
              </Stack>

              {/* Review Comment */}
              {review.comment && (
                <>
                  <Divider className="review-divider" />
                  <Typography className="review-comment">
                    {review.comment}
                  </Typography>
                </>
              )}

              {/* Review Footer with Actions */}
              <Divider className="review-divider" />
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                alignItems="center"
                className="review-footer"
              >
                <Typography variant="caption" className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>

                {editable && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditClick(review)}
                    className="edit-review-btn"
                  >
                    Edit
                  </Button>
                )}

                {!editable && (
                  <Chip
                    label="No longer editable"
                    size="small"
                    variant="outlined"
                    className="expired-chip"
                  />
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {/* Edit Review Dialog */}
      {editingId && reviews.find((r) => r._id === editingId) && (
        <Dialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingId(null);
          }}
          maxWidth="sm"
          fullWidth
          className="edit-review-dialog"
        >
          <Box className="dialog-content">
            <Typography variant="h6" className="dialog-title">
              Edit Review
            </Typography>

            {/* Product Info Display */}
            <Box className="dialog-product-info">
              <Box
                component="img"
                src={
                  reviews.find((r) => r._id === editingId)?.productId
                    ?.productImages?.[0]
                    ? `${serverApi}/${
                        reviews.find((r) => r._id === editingId)?.productId
                          ?.productImages?.[0]
                      }`
                    : "/imgs/pastas.jpg"
                }
                alt="Product"
                className="dialog-product-img"
              />
              <Typography className="dialog-product-name">
                {reviews.find((r) => r._id === editingId)?.productId
                  ?.productName || "Unknown Product"}
              </Typography>
            </Box>

            {/* Rating */}
            <Box className="dialog-field">
              <Typography variant="subtitle2" className="field-label">
                Rating
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating
                  value={tempRating}
                  onChange={(e, value) => {
                    setTempRating(value || 5);
                  }}
                />
                <Typography variant="body2">
                  {tempRating}/5
                </Typography>
              </Box>
            </Box>

            {/* Comment */}
            <Box className="dialog-field">
              <Typography variant="subtitle2" className="field-label">
                Comment
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={tempComment}
                onChange={(e) => {
                  setTempComment(e.target.value);
                }}
                placeholder="Write your review..."
                variant="outlined"
                className="comment-input"
              />
            </Box>

            {/* Dialog Actions */}
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              className="dialog-actions"
            >
              <Button
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditingId(null);
                }}
                variant="outlined"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                className="dialog-save-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}

export default MyReviews;
