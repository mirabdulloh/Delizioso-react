import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Stack, Button, Divider } from "@mui/material";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { Order } from "../../../lib/types/orders";
import { CartItem } from "../../../lib/types/search";
import { OrderItem, OrderUI } from "../../../lib/types/mypage";
import ReviewModal from "../../components/ReviewModal";
import { resolveMediaUrl } from "../../../lib/config";
import {
  sweetErrorHandling,
  sweetSuccessAlert,
  sweetWarningAlert,
} from "../../../lib/sweetAlert";
import { addToCart } from "../OrderOnline/slice";
import { fetchFinishedOrders, fetchMyReviews } from "./slice";
import {
  selectFinishedOrders,
  selectMyReviews,
  selectLoadingOrders,
} from "./selector";
import { AppDispatch } from "../../store";
import "../../../css/finished-orders.css";

function formatOrderDate(date: Date | string): string {
  const orderDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = orderDate.toDateString() === today.toDateString();
  const isYesterday = orderDate.toDateString() === yesterday.toDateString();

  const timeStr = orderDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;

  return orderDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function transformOrderToUI(order: Order, reviews: any[]): OrderUI {
  const items: OrderItem[] = order.orderItems.map((orderItem) => {
    const product = order.productData.find(
      (p) => String(p._id) === String(orderItem.productId),
    );

    const hasReview = reviews.some(
      (rev) =>
        String(rev.orderId) === String(order._id) &&
        String(rev.productId?._id ?? rev.productId) === String(product?._id),
    );

    return {
      id: orderItem._id,
      productId: product?._id || orderItem.productId,
      name: product?.productName || "Unknown Product",
      img: product?.productImages?.[0]
        ? resolveMediaUrl(product.productImages[0])
        : "/imgs/pastas.jpg",
      price: orderItem.itemPrice,
      qty: orderItem.itemQuantity,
      hasReview,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return {
    id: order._id,
    restaurant: "Delizioso Restaurant • Seoul",
    createdAt: formatOrderDate(order.createdAt),
    items,
    subtotal,
  };
}

export default function FinishedOrders() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const orders = useSelector(selectFinishedOrders);
  const reviews = useSelector(selectMyReviews);
  const loading = useSelector(selectLoadingOrders);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<{
    orderId: string;
    productId: string;
    productName: string;
    productImage: string;
  } | null>(null);

  // Fetch orders and reviews on mount
  useEffect(() => {
    dispatch(fetchFinishedOrders());
    dispatch(fetchMyReviews());
  }, [dispatch]);

  const handleReorder = async (order: OrderUI) => {
    try {
      const confirmed = await sweetWarningAlert(
        "Reorder Items",
        "Do you want to add these items to your cart?",
      );

      if (!confirmed) return;

      // Add items to Redux cart using dispatch
      order.items.forEach((item) => {
        console.log("REORDER IMG:", item.img);

        const cartItem: CartItem = {
          _id: item.productId,
          quantity: item.qty,
          name: item.name,
          price: item.price,
          image: resolveMediaUrl(item.img) || "/imgs/pastas.jpg",
        };

        // Dispatch to Redux for each item
        dispatch(addToCart(cartItem));
      });

      await sweetSuccessAlert(
        "Items Added!",
        "Items have been added to your cart. You can review and order them anytime.",
      );

      console.log("✅ Reorder successful - items added to cart");
    } catch (err) {
      console.error("❌ Reorder error:", err);
      await sweetErrorHandling(err);
    }
  };

  const handleWriteReview = (item: OrderItem, orderId: string) => {
    const hasReview = reviews.some(
      (rev) =>
        String(rev.orderId) === String(orderId) &&
        String(rev.productId._id || rev.productId) === String(item.productId),
    );

    if (hasReview) {
      sweetWarningAlert(
        "Already Reviewed",
        "You have already reviewed this item.",
      );
      return;
    }

    setSelectedReviewItem({
      orderId,
      productId: item.productId,
      productName: item.name,
      productImage: item.img,
    });
    setReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    // Refresh reviews from Redux
    dispatch(fetchMyReviews());
  };

  if (loading) {
    return (
      <Box className="finished-orders-loading">
        <Box>Loading orders...</Box>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box className="finished-orders-empty">
        <InboxRoundedIcon style={{ fontSize: 60, color: "#ccc" }} />
        <Box className="empty-text">No finished orders yet</Box>
      </Box>
    );
  }

  // Transform orders from Redux to UI format
  const uiOrders = orders.map((order) => transformOrderToUI(order, reviews));

  return (
    <Box className="finished-orders-container">
      <Box className="finished-orders-title">Recent Orders (Last 30 Days)</Box>
      <Stack spacing={2} className="finished-orders-list">
        {uiOrders.map((order) => (
          <Box key={order.id} className="finished-order-card">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className="order-header"
            >
              <Box>
                <Box className="order-restaurant">{order.restaurant}</Box>
                <Box className="order-date">{order.createdAt}</Box>
              </Box>
              <Box className="order-status-badge">Finished</Box>
            </Stack>

            <Divider className="order-divider" />

            <Stack spacing={1.5} className="order-items">
              {order.items.map((item) => (
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  className="order-item"
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ flex: 1 }}
                    className="order-item-main"
                  >
                    <Box
                      component="img"
                      src={item.img}
                      alt={item.name}
                      className="item-img"
                    />
                    <Box className="item-details">
                      <Box className="item-name">{item.name}</Box>
                      <Box className="item-qty">x{item.qty}</Box>
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    className="order-item-actions"
                  >
                    <Box className="item-price">
                      ${(item.price * item.qty).toFixed(2)}
                    </Box>
                    <Button
                      size="small"
                      variant={item.hasReview ? "text" : "outlined"}
                      startIcon={<RateReviewRoundedIcon />}
                      onClick={() => handleWriteReview(item, order.id)}
                      disabled={item.hasReview}
                      sx={{ minWidth: 100 }}
                      className="review-item-btn"
                    >
                      {item.hasReview ? "Reviewed" : "Review"}
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            <Divider className="order-divider" />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              className="order-footer"
            >
              <Box className="order-total">
                Total:{" "}
                <span className="total-amount">
                  ${order.subtotal.toFixed(2)}
                </span>
              </Box>
              <Stack direction="row" spacing={1} className="order-footer-actions">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<RepeatRoundedIcon />}
                  onClick={() => handleReorder(order)}
                  className="reorder-btn"
                >
                  Reorder
                </Button>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Review Modal */}
      {selectedReviewItem && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          orderId={selectedReviewItem.orderId}
          productId={selectedReviewItem.productId}
          productName={selectedReviewItem.productName}
          productImage={selectedReviewItem.productImage}
          onSuccess={handleReviewSuccess}
        />
      )}
    </Box>
  );
}
