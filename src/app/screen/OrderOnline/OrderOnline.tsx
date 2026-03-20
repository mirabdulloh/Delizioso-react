import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Stack, Button, IconButton, Rating, Divider, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import "../../../css/order-online.css";
import { Order } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { CouponValidationResult } from "../../../lib/types/member";
import OrderService from "../../services/OrderService";
import MemberService from "../../services/MemberService";
import { resolveMediaUrl } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { setPausedOrders, setFinishedOrders, setProcessOrders } from "./slice";
import { retrievePausedOrders, retrieveFinishedOrders, retrieveProcessOrders } from "./selector";
import { sweetErrorHandling, sweetSuccessAlert, sweetWarningAlert } from "../../../lib/sweetAlert";
import { OrderOnlineProps, OrderStatusUI, OrderItem, OrderUI } from "../../../lib/types/order-online";

const FINISHED_ORDERS_STORAGE_PREFIX = "delizioso_hidden_finished_orders";

function getHiddenFinishedOrdersStorageKey(memberId?: string) {
  return `${FINISHED_ORDERS_STORAGE_PREFIX}:${memberId || "guest"}`;
}

function loadHiddenFinishedOrderIds(memberId?: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(getHiddenFinishedOrdersStorageKey(memberId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch (err) {
    console.error("Failed to load hidden finished orders:", err);
    return [];
  }
}

function saveHiddenFinishedOrderIds(memberId: string | undefined, ids: string[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      getHiddenFinishedOrdersStorageKey(memberId),
      JSON.stringify(ids),
    );
  } catch (err) {
    console.error("Failed to save hidden finished orders:", err);
  }
}

function calcSubtotal(items: OrderItem[]) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

// Helper function to map OrderStatus enum to UI status
function mapOrderStatusToUI(status: OrderStatus): OrderStatusUI {
  switch (status) {
    case OrderStatus.PENDING:
      return "PAUSED";
    case OrderStatus.PROCESS:
      return "ONGOING";
    case OrderStatus.FINISH:
      return "FINISHED";
    default:
      return "PAUSED";
  }
}

// Helper function to format date
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

// Helper function to transform API Order to UI Order
function transformOrderToUI(order: Order): OrderUI {
  const items: OrderItem[] = order.orderItems.map((orderItem) => {
    const product = order.productData.find(
      (p) => String(p._id) === String(orderItem.productId)
    );
    
    // 🔥 Debug logging
    if (!product) {
      console.warn(`⚠️ Product not found for orderItem:`, orderItem.productId, `productData:`, order.productData.map(p => p._id));
    }
    
    return {
      id: orderItem._id,
      productId: String(orderItem.productId),
      name: product?.productName || 'Unknown Product',
      img: product?.productImages?.[0] ? resolveMediaUrl(product.productImages[0]) : '/imgs/pastas.jpg',
      price: orderItem.itemPrice,
      qty: orderItem.itemQuantity,
    };
  });

  return {
    id: order._id,
    status: mapOrderStatusToUI(order.orderStatus),
    restaurant: "Delizioso Restaurant • Seoul",
    createdAt: formatOrderDate(order.createdAt),
    etaMin: order.orderStatus === OrderStatus.PROCESS ? 23 : undefined,
    items,
  };
}

function OrderOnline({ cartItems, onAdd, onRemove, onDelete }: OrderOnlineProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const { orderBuilder, authMember, setOrderBuilder, setAuthMember } = useGlobals();
  const member = (authMember as any)?.member ?? authMember;
  const memberId = member?._id;
  const availableCoupon = member?.memberCoupon;
  const showCouponCard = Boolean(availableCoupon?.code && !availableCoupon?.isUsed);
  const [checkoutItems, setCheckoutItems] = useState<OrderItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [hiddenFinishedOrderIds, setHiddenFinishedOrderIds] = useState<string[]>(() =>
    loadHiddenFinishedOrderIds(memberId),
  );

  const handleRemoveQty = useCallback((itemId: string) => {
    setCheckoutItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  const handleAddQty = useCallback((itemId: string) => {
    setCheckoutItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }, []);

  const handleDeleteItem = useCallback((itemId: string) => {
    setCheckoutItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      await sweetErrorHandling({ response: { data: { message: "Please enter a coupon code" } } });
      return;
    }

    try {
      // Call backend API to validate coupon
      const memberService = new MemberService();
      const result: CouponValidationResult = await memberService.validateCoupon(couponCode.trim());

      console.log("Coupon validation result:", result);

      // Check if coupon is already used
      if (result?.memberCoupon?.isUsed) {
        await sweetErrorHandling({
          response: { data: { message: "This coupon has already been used" } },
        });
        return;
      }

      if (result && result.valid === true) {
        setAppliedCoupon({
          code: couponCode,
          discount: result.discount || 5,
        });
        await sweetSuccessAlert(
          "Coupon Applied",
          `You are using $${result.discount || 5} coupon.`
        );
        setCouponCode("");
      } else {
        const errorMsg = result?.message || "Invalid or already used coupon code";
        await sweetErrorHandling({
          response: { data: { message: errorMsg } },
        });
      }
    } catch (err: any) {
      console.error("Coupon validation error:", err);
      const errorMessage = err?.response?.data?.message || "Failed to validate coupon";
      await sweetErrorHandling({
        response: { data: { message: errorMessage } },
      });
    }
  };

  const hasAddress = () => {
    const address = member?.memberAddress || (member as any)?.memberAdress;
    const hasAddr = Boolean(address && address.trim());
    console.log("✅ Has Address:", hasAddr, "Address value:", address);
    return hasAddr;
  };
  const [activeStatus, setActiveStatus] = useState<OrderStatusUI>("PAUSED");
  const [selectedId, setSelectedId] = useState<string>("");
  
  // Get orders from Redux store
  const pausedOrders = useSelector(retrievePausedOrders);
  const finishedOrders = useSelector(retrieveFinishedOrders);
  const processOrders = useSelector(retrieveProcessOrders);

  // Clear orders when user logs out or changes
  useEffect(() => {
    if (!authMember) {
      console.log("❌ User logged out, clearing orders");
      dispatch(setPausedOrders([]));
      dispatch(setProcessOrders([]));
      dispatch(setFinishedOrders([]));
    }
  }, [authMember, dispatch]);

  useEffect(() => {
    setHiddenFinishedOrderIds(loadHiddenFinishedOrderIds(memberId));
  }, [memberId]);

  useEffect(() => {
    saveHiddenFinishedOrderIds(memberId, hiddenFinishedOrderIds);
  }, [memberId, hiddenFinishedOrderIds]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("🔍 Fetching orders... Auth Member:", authMember);
        
        if (!authMember) {
          console.log("❌ No authenticated member, skipping order fetch");
          return;
        }

        const orderService = new OrderService();
        
        // Fetch all order statuses
        console.log("📡 Calling API for orders...");
        const [pausedData, processData, finishedData] = await Promise.all([
          orderService.getMyOrders({ page: 1, limit: 10, orderStatus: OrderStatus.PENDING }),
          orderService.getMyOrders({ page: 1, limit: 10, orderStatus: OrderStatus.PROCESS }),
          orderService.getMyOrders({ page: 1, limit: 10, orderStatus: OrderStatus.FINISH }),
        ]);

        console.log("✅ Orders fetched:", {
          paused: pausedData.length,
          process: processData.length,
          finished: finishedData.length
        });

        // Dispatch to Redux store
        dispatch(setPausedOrders(pausedData));
        dispatch(setProcessOrders(processData));
        dispatch(setFinishedOrders(finishedData));
        
        // Set first paused order as selected by default
        const allOrders = [...pausedData, ...processData, ...finishedData];
        const firstPaused = allOrders.find(o => o.orderStatus === OrderStatus.PENDING);
        if (firstPaused && !selectedId) {
          setSelectedId(firstPaused._id);
        }
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        dispatch(setPausedOrders([]));
        dispatch(setProcessOrders([]));
        dispatch(setFinishedOrders([]));
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBuilder]); // Re-fetch when orderBuilder changes (new order created)

  // Transform orders to UI format
  const visibleFinishedOrders = finishedOrders.filter((order) => {
    // Keep only recent finished orders and respect the local clear action for this page.
    const orderDate = new Date(order.updatedAt || order.createdAt);
    const now = new Date();
    const diffInSeconds = (now.getTime() - orderDate.getTime()) / 1000;

    return (
      diffInSeconds <= 86400 &&
      !hiddenFinishedOrderIds.includes(order._id)
    );
  });

  const allOrders: OrderUI[] = [
    ...pausedOrders.map(transformOrderToUI),
    ...processOrders.map(transformOrderToUI),
    ...visibleFinishedOrders.map(transformOrderToUI),
  ];

  const filtered = allOrders.filter((o) => o.status === activeStatus);
  const selectedOrder = allOrders.find((o) => o.id === selectedId) ?? filtered[0] ?? allOrders[0];

  // Initialize checkout items when selected order changes (only on order/status change, not on every render)
  useEffect(() => {
    if (!selectedOrder || activeStatus !== "PAUSED") return;
    setCheckoutItems(selectedOrder.items);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, activeStatus]);

  const visibleSelected =
    selectedOrder && selectedOrder.status === activeStatus ? selectedOrder : filtered[0] ?? null;

  // Get the original backend order object (not transformed)
  const getRawOrder = () => {
    const orderId = visibleSelected?.id;
    if (!orderId) return null;
    if (activeStatus === "PAUSED") {
      return pausedOrders.find(o => o._id === orderId);
    } else if (activeStatus === "ONGOING") {
      return processOrders.find(o => o._id === orderId);
    } else {
      return finishedOrders.find(o => o._id === orderId);
    }
  };

  const rawOrder = getRawOrder();
  const subtotal = checkoutItems.length > 0 ? calcSubtotal(checkoutItems) : (visibleSelected ? calcSubtotal(visibleSelected.items) : 0);
  
  // Calculate prices based on order stage
  let deliveryFee: number;
  let couponDiscount: number;
  let total: number;

  if (activeStatus === "PAUSED") {
    // PENDING stage: Calculate based on appliedCoupon in checkout
    deliveryFee = appliedCoupon ? 0 : 5;
    couponDiscount = appliedCoupon?.discount ?? 0;
    total = Math.round((subtotal + deliveryFee - couponDiscount) * 100) / 100;
  } else {
    // PROCESS & FINISH stages: Read from backend order (values set at payment time)
    deliveryFee = rawOrder?.deliveryFee ?? 5;
    couponDiscount = rawOrder?.couponDiscount ?? 0;
    total = rawOrder?.totalAmount ?? Math.round((subtotal + deliveryFee - couponDiscount) * 100) / 100;
  }

  const handleDownloadReceipt = async () => {
    if (!visibleSelected) return;

    const items = visibleSelected.items;
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Order Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 400px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .receipt {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .restaurant-name {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            .order-date {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            .order-id {
              font-size: 11px;
              color: #999;
              margin-top: 5px;
              word-break: break-all;
            }
            .items-section {
              margin-bottom: 15px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
              font-size: 13px;
            }
            .item-name {
              flex: 1;
            }
            .item-qty {
              margin: 0 10px;
              color: #666;
            }
            .item-price {
              font-weight: bold;
              text-align: right;
              min-width: 60px;
            }
            .totals-section {
              border-top: 2px solid #333;
              border-bottom: 2px solid #333;
              padding: 10px 0;
              margin: 15px 0;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-size: 13px;
            }
            .total-row.final {
              font-size: 16px;
              font-weight: bold;
              color: #2c3e50;
            }
            .label {
              color: #666;
            }
            .value {
              text-align: right;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              font-size: 11px;
              color: #999;
            }
            .thank-you {
              text-align: center;
              margin-top: 15px;
              font-size: 14px;
              font-weight: bold;
              color: #27ae60;
            }
            @media print {
              body {
                background-color: white;
              }
              .receipt {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="restaurant-name">${visibleSelected.restaurant}</div>
              <div class="order-date">Order Date: ${visibleSelected.createdAt}</div>
              <div class="order-id">Order ID: ${visibleSelected.id}</div>
            </div>

            <div class="items-section">
              ${items
                .map(
                  (item) => `
                <div class="item">
                  <div class="item-name">${item.name}</div>
                  <div class="item-qty">x${item.qty}</div>
                  <div class="item-price">$${(item.price * item.qty).toFixed(2)}</div>
                </div>
              `,
                )
                .join("")}
            </div>

            <div class="totals-section">
              <div class="total-row">
                <span class="label">Subtotal</span>
                <span class="value">$${subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span class="label">Delivery Fee</span>
                <span class="value">$${deliveryFee.toFixed(2)}</span>
              </div>
              ${
                appliedCoupon
                  ? `
                <div class="total-row">
                  <span class="label">Coupon Discount (${appliedCoupon.code})</span>
                  <span class="value">-$${appliedCoupon.discount.toFixed(2)}</span>
                </div>
              `
                  : ""
              }
              <div class="total-row final">
                <span class="label">Total</span>
                <span class="value">$${total.toFixed(2)}</span>
              </div>
            </div>

            <div class="thank-you">
              Thank you for your order! 🙏
            </div>

            <div class="footer">
              <p>Delizioso Restaurant</p>
              <p>Seoul, South Korea</p>
              <p>Order Status: ${visibleSelected.status}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      // Create a blob and download
      const blob = new Blob([receiptHTML], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${visibleSelected.id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      await sweetSuccessAlert("Receipt Downloaded", "Your receipt has been downloaded successfully.");
    } catch (err) {
      console.error("❌ Download receipt error:", err);
      await sweetErrorHandling({
        response: { data: { message: "Failed to download receipt" } }
      });
    }
  };

  return (
    <div className="orders-page">
      <Container>
        {/* HEADER */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          className="orders-header"
        >
          <Box>
            <Box className="orders-title">Orders</Box>
            <Box className="orders-subtitle">Paused • Ongoing • Finished</Box>
          </Box>
        </Stack>

        {/* LAYOUT */}
        <Box className="orders-layout">
          {/* LEFT SIDEBAR */}
          <Box className="orders-left">
            <Box className="orders-panel">
              <Box className="orders-panel-title">Status</Box>

              <Stack spacing={1.2} mt={2}>
                <Button
                  className={`orders-statusBtn ${activeStatus === "PAUSED" ? "active" : ""}`}
                  startIcon={<PauseCircleRoundedIcon />}
                  onClick={() => setActiveStatus("PAUSED")}
                >
                  Paused
                </Button>

                <Button
                  className={`orders-statusBtn ${activeStatus === "ONGOING" ? "active" : ""}`}
                  startIcon={<LocalShippingRoundedIcon />}
                  onClick={() => setActiveStatus("ONGOING")}
                >
                  Ongoing
                </Button>

                <Button
                  className={`orders-statusBtn ${activeStatus === "FINISHED" ? "active" : ""}`}
                  startIcon={<CheckCircleRoundedIcon />}
                  onClick={() => setActiveStatus("FINISHED")}
                >
                  Finished
                </Button>
              </Stack>

              {activeStatus === "FINISHED" && visibleFinishedOrders.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  sx={{ mt: 1.5 }}
                  onClick={async () => {
                    const confirmed = await sweetWarningAlert(
                      "Clear Finished Orders",
                      "Are you sure you want to clear all finished orders from this page?"
                    );
                    if (confirmed) {
                      setHiddenFinishedOrderIds((prev) =>
                        Array.from(
                          new Set([
                            ...prev,
                            ...visibleFinishedOrders.map((order) => order._id),
                          ]),
                        ),
                      );
                      setSelectedId("");
                      await sweetSuccessAlert(
                        "Cleared",
                        "Finished orders were cleared from the recent orders page."
                      );
                    }
                  }}
                >
                  Clear Finished Orders
                </Button>
              )}

              <Divider className="orders-divider" />

              <Box className="orders-panel-title">Quick Filters</Box>
              <Stack spacing={1} mt={1.5}>
                <Box className="orders-filterRow">
                  <Box className="orders-filterLabel">Only Best seller</Box>
                  <Box className="orders-filterChip">ON</Box>
                </Box>
                <Box className="orders-filterRow">
                  <Box className="orders-filterLabel">Free delivery</Box>
                  <Box className="orders-filterChip">OFF</Box>
                </Box>
                <Box className="orders-filterRow">
                  <Box className="orders-filterLabel">Ready under 30 min</Box>
                  <Box className="orders-filterChip">ON</Box>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* CENTER LIST */}
          <Box className="orders-center">
            <Box className="orders-center-scroll">
              <Stack spacing={2}>
                {filtered.length === 0 ? (
                  <Box className="orders-empty" key="empty">
                    <InboxRoundedIcon style={{ fontSize: 60, color: "#ccc" }} />
                    <Box className="orders-emptyText">No orders found</Box>
                    <Button variant="outlined" onClick={() => navigate("/products")}>
                      Browse Menu
                    </Button>
                  </Box>
                ) : (
                  filtered.map((o) => {
                  const isActive = visibleSelected?.id === o.id;
                  const osub = calcSubtotal(o.items);

                  return (
                    <Box
                      key={o.id}
                      className={`orderCard ${isActive ? "active" : ""}`}
                      role="button"
                      onClick={() => setSelectedId(o.id)}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Box className="orderCard-restaurant">{o.restaurant}</Box>
                          <Box className="orderCard-date">{o.createdAt}</Box>
                        </Box>

                        <Box className={`orderCard-status ${o.status.toLowerCase()}`}>
                          {o.status === "PAUSED"
                            ? "Paused"
                            : o.status === "ONGOING"
                            ? "Ongoing"
                            : "Finished"}
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1.5} className="orderCard-items" mt={2}>
                        {o.items.slice(0, 3).map((it) => (
                          <Box key={it.id} className="orderMini">
                            <Box component="img" src={it.img} alt={it.name} className="orderMini-img" />
                            <Box className="orderMini-name">{it.name}</Box>
                            <Box className="orderMini-qty">x{it.qty}</Box>
                          </Box>
                        ))}
                        {o.items.length > 3 ? <Box className="orderMini-more">+{o.items.length - 3}</Box> : null}
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                        <Stack direction="row" spacing={1} alignItems="center" className="orderCard-meta">
                          <Rating value={4} readOnly size="small" />
                          {o.status === "ONGOING" ? (
                            <Box className="orderCard-eta">
                              <AccessTimeRoundedIcon />
                              <span>{o.etaMin} min</span>
                            </Box>
                          ) : (
                            <Box className="orderCard-eta muted">
                              <ReceiptLongRoundedIcon />
                              <span>{o.items.length} items</span>
                            </Box>
                          )}
                        </Stack>

                        <Box className="orderCard-total">${osub.toFixed(2)}</Box>
                      </Stack>
                    </Box>
                  );
                })
              )}
              </Stack>
            </Box>
          </Box>

          {/* RIGHT STICKY SUMMARY */}
          <Box className="orders-right">
            {visibleSelected ? (
              <Box className="orders-summary">
                {/* DELIVERY ANIMATION FOR ONGOING ORDERS */}
                {activeStatus === "ONGOING" && (
                  <Box className="delivery-animation-container">
                    <Box className="delivery-road">
                      <Box className="delivery-man">
                        <LocalShippingRoundedIcon className="delivery-truck-icon" />
                      </Box>
                    </Box>
                    <Box className="delivery-status-text">
                      Your order is on the way! 🚀
                    </Box>
                  </Box>
                )}

                <Box className="orders-summary-title">
                  {activeStatus === "PAUSED"
                    ? "Checkout"
                    : activeStatus === "ONGOING"
                    ? "Order Tracking"
                    : "Order Details"}
                </Box>

                {/* ITEMS LIST */}
                <Box className="summary-items">
                  {(activeStatus === "PAUSED" ? checkoutItems : visibleSelected?.items || []).map((it) => (
                    <Box key={it.id} className="summary-item">
                      <Stack direction="row" spacing={1.2} alignItems="center" className="summary-main">
                        <Box component="img" src={it.img} alt={it.name} className="summary-img" />
                        <Box className="summary-name">{it.name}</Box>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center" className="summary-controls">
                        {activeStatus === "PAUSED" ? (
                          <Stack direction="row" spacing={0.6} alignItems="center" className="summary-qty">
                            <IconButton 
                              className="summary-qtyBtn"
                              onClick={() => handleRemoveQty(it.id)}
                            >
                              <RemoveRoundedIcon />
                            </IconButton>
                            <Box className="summary-qtyNum">{it.qty}</Box>
                            <IconButton 
                              className="summary-qtyBtn"
                              onClick={() => handleAddQty(it.id)}
                            >
                              <AddRoundedIcon />
                            </IconButton>
                          </Stack>
                        ) : (
                          <Box className="summary-qtyText">x{it.qty}</Box>
                        )}

                        <Box className="summary-price">${(it.price * it.qty).toFixed(2)}</Box>

                        {activeStatus === "PAUSED" ? (
                          <IconButton 
                            className="summary-del"
                            onClick={() => handleDeleteItem(it.id)}
                          >
                            <DeleteOutlineRoundedIcon />
                          </IconButton>
                        ) : null}
                      </Stack>
                    </Box>
                  ))}
                </Box>

                <Divider className="orders-divider" />

                {/* COUPON SECTION */}
                {activeStatus === "PAUSED" && (
                  <Box className="coupon-section">
                    {showCouponCard && (
                      <Box className="coupon-card">
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          className="coupon-card-row"
                        >
                          <Box className="coupon-card-content">
                            <Box className="coupon-card-title">🎉 You have a coupon!</Box>
                            <Box className="coupon-card-code">{availableCoupon.code}</Box>
                            <Box className="coupon-card-subtitle">
                              Save ${availableCoupon.discount || 5} on delivery
                            </Box>
                          </Box>
                          <IconButton
                            aria-label="Copy coupon code"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard?.writeText(availableCoupon.code).catch(() => undefined);
                              setCouponCode(availableCoupon.code);
                            }}
                            className="coupon-copy-btn"
                          >
                            <ContentCopyRoundedIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                    )}
                    <Box className="coupon-apply-title">Apply Coupon</Box>
                    <Stack direction="row" spacing={1} className="coupon-form">
                      <TextField
                        size="small"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={appliedCoupon !== null}
                        className="coupon-input"
                        fullWidth
                      />
                      {!appliedCoupon ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleApplyCoupon}
                          className="coupon-apply-btn"
                        >
                          Apply
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => setAppliedCoupon(null)}
                          className="coupon-remove-btn"
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                    {appliedCoupon && (
                      <Box className="coupon-applied-banner">
                        ✓ Coupon {appliedCoupon.code} applied - Save ${appliedCoupon.discount}!
                      </Box>
                    )}
                  </Box>
                )}

                <Divider className="orders-divider" />
                <Stack spacing={1.2} className="summary-totals">
                  <Stack direction="row" justifyContent="space-between">
                    <Box className="tlabel">Subtotal</Box>
                    <Box className="tval">${subtotal.toFixed(2)}</Box>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Box className="tlabel">Delivery</Box>
                    <Box className={`tval delivery-val ${deliveryFee === 0 ? "applied" : ""}`}>
                      ${deliveryFee.toFixed(2)}
                    </Box>
                  </Stack>
                  {couponDiscount > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Box className="tlabel">Coupon Discount</Box>
                      <Box className="tval coupon-discount-val">
                        -${couponDiscount.toFixed(2)}
                      </Box>
                    </Stack>
                  )}

                  <Stack direction="row" justifyContent="space-between" className="summary-totalRow">
                    <Box className="tlabel big">Total</Box>
                    <Box className="tval big">${total.toFixed(2)}</Box>
                  </Stack>
                </Stack>

                {/* ACTIONS */}
                <Stack spacing={1.2} mt={2} className="summary-actions">
                  {activeStatus === "PAUSED" ? (
                    <>
                      <Button
                        className="summary-primary"
                        variant="contained"
                        color="secondary"
                        onClick={async () => {
                          if (!hasAddress()) {
                                                        await sweetErrorHandling({
                                                          response: {
                                                            data: {
                                                              message: "Please add your delivery address in your Member profile before paying."
                                                            }
                                                          }
                                                        });
                            navigate("/my-page");
                            return;
                          }

                          try {
                            // Ask for confirmation
                            const confirmed = await sweetWarningAlert(
                              "Confirm Payment",
                              `Are you ready to pay $${total.toFixed(2)}? This order will move to Ongoing.`
                            );

                            if (!confirmed) return;
                            
                            // Update order status from PENDING to PROCESS
                            if (visibleSelected) {
                              const orderService = new OrderService();
                              await orderService.updateOrder({
                                orderId: visibleSelected.id,
                                orderStatus: OrderStatus.PROCESS,
                                couponCode: appliedCoupon?.code,
                                deliveryFee: deliveryFee,
                                couponDiscount: couponDiscount,
                                totalAmount: total,
                                orderItems: checkoutItems.map((item) => ({
                                  productId: item.productId,
                                  itemQuantity: item.qty,
                                  itemPrice: item.price,
                                })),
                              });
                              
                              // Refresh member data to get updated coupon status (isUsed: true)
                              const memberService = new MemberService();
                              const freshMember = await memberService.getMemberDetail();
                              setAuthMember(freshMember); // Update global state with fresh member data
                              
                              // Clear applied coupon from UI state
                              setAppliedCoupon(null);
                              
                              // Show success alert
                              await sweetSuccessAlert(
                                "Payment Successful!",
                                "Your order has been confirmed and is now being prepared."
                              );

                              console.log("✅ Payment successful - Order status updated to PROCESS");
                              console.log("✅ Member data refreshed - Coupon marked as used");
                              
                              // Switch to ONGOING tab automatically
                              setActiveStatus("ONGOING");
                              
                              // Re-fetch orders to update the UI (backend will mark coupon as used)
                              // NOTE: Backend checks on order update - if user now has 5+ FINISHED orders,
                              // generate and assign new reward coupon to memberCoupon (if not already assigned)
                              setOrderBuilder(new Date());
                            }
                          } catch (err) {
                            console.error("❌ Payment error:", err);
                            await sweetErrorHandling(err);
                          }
                        }}
                      >
                        Pay now
                      </Button>
                      <Button 
                        className="summary-secondary"
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={async () => {
                          try {
                            // Ask for confirmation
                            const confirmed = await sweetWarningAlert(
                              "Cancel Order",
                              "Are you sure you want to cancel this order? This action cannot be undone."
                            );

                            if (!confirmed) return;
                            
                            // Update order status to DELETED
                            if (visibleSelected) {
                              const orderService = new OrderService();
                              await orderService.updateOrder({
                                orderId: visibleSelected.id,
                                orderStatus: "DELETED" as any,
                              });
                              
                              // Show success alert
                              await sweetSuccessAlert(
                                "Order Cancelled",
                                "Your order has been cancelled successfully."
                              );

                              console.log("✅ Order cancelled successfully");
                              
                              // Re-fetch orders to update the UI
                              setOrderBuilder(new Date());
                            }
                          } catch (err) {
                            console.error("❌ Cancel order error:", err);
                            await sweetErrorHandling(err);
                          }
                        }}
                      >
                        Cancel Order
                      </Button>
                      {!hasAddress() && (
                        <Box
                          sx={{
                            backgroundColor: "rgba(255, 152, 0, 0.1)",
                            border: "1px solid #ff9800",
                            borderRadius: "12px",
                            padding: "12px",
                            textAlign: "center",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#ff9800",
                          }}
                        >
                          📍 Add your delivery address to proceed with payment
                        </Box>
                      )}
                      <Button className="summary-secondary" variant="outlined" onClick={() => navigate("/products")}>
                        Continue shopping
                      </Button>
                    </>
                  ) : activeStatus === "ONGOING" ? (
                    <>
                      <Box className="summary-info">
                        <AccessTimeRoundedIcon />
                        <span>Estimated arrival: 23 minutes</span>
                      </Box>
                      <Button 
                        className="summary-primary" 
                        variant="contained" 
                        color="primary"
                        onClick={async () => {
                          try {
                            // Ask for confirmation
                            const confirmed = await sweetWarningAlert(
                              "Confirm Receipt",
                              "Did you receive your order?"
                            );

                            if (!confirmed) return;
                            
                            // Update order status from PROCESS to FINISH
                            if (visibleSelected) {
                              const orderService = new OrderService();
                              const previousCouponCode = member?.memberCoupon?.code;
                              const previousCouponWasUsed = Boolean(member?.memberCoupon?.isUsed);
                              await orderService.updateOrder({
                                orderId: visibleSelected.id,
                                orderStatus: OrderStatus.FINISH,
                              });

                              const memberService = new MemberService();
                              const freshMember = await memberService.getMemberDetail();
                              setAuthMember(freshMember);

                              const nextCoupon = freshMember?.memberCoupon;
                              const earnedNewCoupon = Boolean(
                                nextCoupon?.code &&
                                  !nextCoupon.isUsed &&
                                  (nextCoupon.code !== previousCouponCode || previousCouponWasUsed)
                              );
                              
                              // Show success alert
                              await sweetSuccessAlert(
                                "Order Completed!",
                                earnedNewCoupon
                                  ? "Thank you! Your order has been marked as completed. A new reward coupon was added to your account."
                                  : "Thank you! Your order has been marked as completed."
                              );

                              console.log("✅ Order marked as finished - Order status updated to FINISH");
                              
                              // Switch to FINISHED tab automatically
                              setActiveStatus("FINISHED");
                              
                              // Re-fetch orders to update the UI
                              setOrderBuilder(new Date());
                            }
                          } catch (err) {
                            console.error("❌ Order completion error:", err);
                            await sweetErrorHandling(err);
                          }
                        }}
                      >
                        I received the order
                      </Button>
                      <Button className="summary-secondary" variant="outlined" onClick={() => navigate("/help")}>
                        Help / Support
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* <Button 
                        className="summary-primary" 
                        variant="contained" 
                        color="secondary"
                        onClick={async () => {
                          try {
                            if (!visibleSelected) return;
                            
                            // Ask for confirmation
                            const confirmed = await sweetWarningAlert(
                              "Reorder Items",
                              "Do you want to create a new order with the same items?"
                            );

                            if (!confirmed) return;
                            
                            // Transform order items to CartItem format for createOrder
                            const cartItems = visibleSelected.items.map((item) => ({
                              _id: item.productId,
                              quantity: item.qty,
                              name: item.name,
                              price: item.price,
                              image: item.img,
                            }));
                            
                            // Create new order
                            const orderService = new OrderService();
                            await orderService.createOrder(cartItems);
                            
                            // Show success alert
                            await sweetSuccessAlert(
                              "Order Created!",
                              "Your order has been created and is ready for checkout."
                            );

                            console.log("✅ Reorder successful - New order created in PAUSED status");
                            
                            // Switch to PAUSED tab automatically
                            setActiveStatus("PAUSED");
                            
                            // Re-fetch orders to show the new paused order
                            setOrderBuilder(new Date());
                          } catch (err) {
                            console.error("❌ Reorder error:", err);
                            await sweetErrorHandling(err);
                          }
                        }}
                      >
                        Order again
                      </Button> */}
                      <Button 
                        className="summary-secondary" 
                        variant="outlined"
                        onClick={handleDownloadReceipt}
                      >
                        Download Receipt
                      </Button>
                    </>
                  )}
                </Stack>
              </Box>
            ) : (
              <Box className="orders-summary empty">
                <InboxRoundedIcon style={{ fontSize: 48, color: "#ccc" }} />
                <Box sx={{ mt: 1 }}>No orders to display</Box>
                <Button variant="text" onClick={() => navigate("/products")}>
                  Go to Menu
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default OrderOnline;
