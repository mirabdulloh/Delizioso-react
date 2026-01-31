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
import { serverApi } from "../../../lib/config";
import { sweetErrorHandling, sweetSuccessAlert, sweetWarningAlert } from "../../../lib/sweetAlert";
import "../../../css/finished-orders.css";

interface OrderItem {
  id: string;
  name: string;
  img: string;
  price: number;
  qty: number;
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

function transformOrderToUI(order: Order): OrderUI {
  const items: OrderItem[] = order.orderItems.map((orderItem, index) => {
    const product = order.productData[index];
    return {
      id: orderItem._id,
      name: product?.productName || 'Unknown Product',
      img: product?.productImages?.[0] ? `${serverApi}/${product.productImages[0]}` : '/imgs/pastas.jpg',
      price: orderItem.itemPrice,
      qty: orderItem.itemQuantity,
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

  useEffect(() => {
    const fetchFinishedOrders = async () => {
      try {
        setLoading(true);
        const orderService = new OrderService();
        const orders = await orderService.getMyOrders({ 
          page: 1, 
          limit: 20, 
          orderStatus: OrderStatus.FINISH 
        });
        
        // Filter orders from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentOrders = orders.filter((order) => {
          const orderDate = new Date(order.updatedAt || order.createdAt);
          return orderDate >= thirtyDaysAgo;
        });

        setFinishedOrders(recentOrders.map(transformOrderToUI));
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

  const handleWriteReview = (order: OrderUI) => {
    // TODO: Implement review functionality
    console.log("Write review for order:", order.id);
    sweetSuccessAlert("Coming Soon", "Review feature will be available soon!");
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
                  className="order-item"
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
                  <Box className="item-price">${(item.price * item.qty).toFixed(2)}</Box>
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
                  variant="outlined"
                  size="small"
                  startIcon={<RateReviewRoundedIcon />}
                  onClick={() => handleWriteReview(order)}
                  className="review-btn"
                >
                  Write Review
                </Button>
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
    </Box>
  );
}
