import React, { useEffect, useState } from "react";
import { Box, Stack, Button, IconButton, Rating, Divider } from "@mui/material";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import { useNavigate } from "react-router-dom";
import { Order } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import ReviewService from "../../services/ReviewService";
import ReviewModal from "../../components/ReviewModal";
import { serverApi } from "../../../lib/config";
import { sweetErrorHandling, sweetSuccessAlert, sweetWarningAlert } from "../../../lib/sweetAlert";
import "../../../css/finished-orders.css";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  img: string;
  price: number;
  qty: number;
  hasReview?: boolean;
}

interface OrderUI {
  id: string;
  restaurant: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
}

function formatOrderDate(date: Date): string {
  const orderDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = orderDate.toDateString() === today.toDateString();
  const isYesterday = orderDate.toDateString() === yesterday.toDateString();
  
  const timeStr = orderDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  
  return orderDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function transformOrderToUI(order: Order, existingReviews: any[]): OrderUI {
  const items: OrderItem[] = order.orderItems.map((orderItem, index) => {
    const product = order.productData[index];
    const hasReview = existingReviews.some(
      (rev) => String(rev.orderId) === String(order._id) && String(rev.productId._id || rev.productId) === String(product?._id)
    );
    return {
      id: orderItem._id,
      productId: product?._id || '',
      name: product?.productName || 'Unknown Product',
      img: product?.productImages?.[0] ? `${serverApi}/${product.productImages[0]}` : '/imgs/pastas.jpg',
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
  const navigate = useNavigate();
  const [finishedOrders, setFinishedOrders] = useState<OrderUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<{
    orderId: string;
    productId: string;
    productName: string;
    productImage: string;
  } | null>(null);

  useEffect(() => {
    const fetchFinishedOrders = async () => {
      try {
        setLoading(true);
        const orderService = new OrderService();
        const reviewService = new ReviewService();
        
        const [orders, existingReviews] = await Promise.all([
          orderService.getMyOrders({ 
            page: 1, 
            limit: 20, 
            orderStatus: OrderStatus.FINISH 
          }),
          reviewService.getMyReviews().catch(() => [])
        ]);
        
        // Filter orders from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentOrders = orders.filter((order) => {
          const orderDate = new Date(order.updatedAt || order.createdAt);
          return orderDate >= thirtyDaysAgo;
        });

        setFinishedOrders(recentOrders.map(order => transformOrderToUI(order, existingReviews)));
      } catch (err) {
        console.error("❌ Failed to fetch finished orders:", err);
        setFinishedOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedOrders();
  }, []);

  const handleReorder = async (order: OrderUI) => {
    try {
      const confirmed = await sweetWarningAlert(
        "Reorder Items",
        "Do you want to create a new order with the same items?"
      );

      if (!confirmed) return;
      
      // Transform order items to CartItem format
      const cartItems = order.items.map((item) => ({
        _id: item.id,
        quantity: item.qty,
        name: item.name,
        price: item.price,
        image: item.img,
      }));
      
      // Create new order
      const orderService = new OrderService();
      await orderService.createOrder(cartItems);
      
      await sweetSuccessAlert(
        "Order Created!",
        "Your order has been created. Go to Orders page to complete checkout."
      );

      console.log("✅ Reorder successful");
      
      // Navigate to orders page
      navigate("/orders");
    } catch (err) {
      console.error("❌ Reorder error:", err);
      await sweetErrorHandling(err);
    }
  };

  const handleWriteReview = (item: OrderItem, orderId: string) => {
    if (item.hasReview) {
      sweetWarningAlert("Already Reviewed", "You have already reviewed this item.");
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
    // Refresh orders to update review status
    window.location.reload();
  };

  if (loading) {
    return (
      <Box className="finished-orders-loading">
        <Box>Loading orders...</Box>
      </Box>
    );
  }

  if (finishedOrders.length === 0) {
    return (
      <Box className="finished-orders-empty">
        <InboxRoundedIcon style={{ fontSize: 60, color: "#ccc" }} />
        <Box className="empty-text">No finished orders yet</Box>
        <Button variant="outlined" onClick={() => navigate("/products")}>
          Browse Menu
        </Button>
      </Box>
    );
  }

  return (
    <Box className="finished-orders-container">
      <Box className="finished-orders-title">Recent Orders (Last 30 Days)</Box>
      <Stack spacing={2} className="finished-orders-list">
        {finishedOrders.map((order) => (
          <Box key={order.id} className="finished-order-card">
            <Stack direction="row" justifyContent="space-between" alignItems="center" className="order-header">
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
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
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
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box className="item-price">${(item.price * item.qty).toFixed(2)}</Box>
                    <Button
                      size="small"
                      variant={item.hasReview ? "text" : "outlined"}
                      startIcon={<RateReviewRoundedIcon />}
                      onClick={() => handleWriteReview(item, order.id)}
                      disabled={item.hasReview}
                      sx={{ minWidth: 100 }}
                    >
                      {item.hasReview ? "Reviewed" : "Review"}
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            <Divider className="order-divider" />

            <Stack direction="row" justifyContent="space-between" alignItems="center" className="order-footer">
              <Box className="order-total">
                Total: <span className="total-amount">${order.subtotal.toFixed(2)}</span>
              </Box>
              <Stack direction="row" spacing={1}>
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
