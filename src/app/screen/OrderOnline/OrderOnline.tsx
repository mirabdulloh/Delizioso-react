import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Stack, Button, IconButton, Rating, Divider } from "@mui/material";
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

import "../../../css/order-online.css";
import { Order } from "../../../lib/types/orders";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { setPausedOrders, setFinishedOrders, setProcessOrders } from "./slice";
import { retrievePausedOrders, retrieveFinishedOrders, retrieveProcessOrders } from "./selector";
import { sweetErrorHandling, sweetSuccessAlert, sweetWarningAlert } from "../../../lib/sweetAlert";
import { CartItem } from "../../../lib/types/search";

type OrderStatusUI = "PAUSED" | "ONGOING" | "FINISHED";

type OrderItem = {
  id: string;
  name: string;
  img: string;
  price: number;
  qty: number;
};

type OrderUI = {
  id: string;
  status: OrderStatusUI;
  restaurant: string;
  createdAt: string;
  etaMin?: number;
  items: OrderItem[];
};

export interface OrderOnlineProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
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
  const { orderBuilder, authMember, setOrderBuilder } = useGlobals();
  const [checkoutItems, setCheckoutItems] = useState<OrderItem[]>([]);

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

  const hasAddress = () => {
    console.log("🔍 Checking address... authMember:", authMember);
    const hasAddr = Boolean(authMember?.memberAddress && authMember.memberAddress.trim());
    console.log("✅ Has Address Result:", hasAddr, "Address value:", authMember?.memberAddress);
    return hasAddr;
  };
  const [activeStatus, setActiveStatus] = useState<OrderStatusUI>("PAUSED");
  const [selectedId, setSelectedId] = useState<string>("");
  
  // Get orders from Redux store
  const pausedOrders = useSelector(retrievePausedOrders);
  const finishedOrders = useSelector(retrieveFinishedOrders);
  const processOrders = useSelector(retrieveProcessOrders);

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
  const allOrders: OrderUI[] = [
    ...pausedOrders.map(transformOrderToUI),
    ...processOrders.map(transformOrderToUI),
    ...finishedOrders.map(transformOrderToUI),
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

  const subtotal = checkoutItems.length > 0 ? calcSubtotal(checkoutItems) : (visibleSelected ? calcSubtotal(visibleSelected.items) : 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const delivery = 0;
  const total = Math.round((subtotal + tax + delivery) * 100) / 100;

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
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Box component="img" src={it.img} alt={it.name} className="summary-img" />
                        <Box className="summary-name">{it.name}</Box>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
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

                {/* TOTALS */}
                <Stack spacing={1.2} className="summary-totals">
                  <Stack direction="row" justifyContent="space-between">
                    <Box className="tlabel">Subtotal</Box>
                    <Box className="tval">${subtotal.toFixed(2)}</Box>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Box className="tlabel">Tax</Box>
                    <Box className="tval">${tax.toFixed(2)}</Box>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Box className="tlabel">Delivery</Box>
                    <Box className="tval">${delivery.toFixed(2)}</Box>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" className="summary-totalRow">
                    <Box className="tlabel big">Total</Box>
                    <Box className="tval big">${total.toFixed(2)}</Box>
                  </Stack>
                </Stack>

                {/* ACTIONS */}
                <Stack spacing={1.2} mt={2}>
                  {activeStatus === "PAUSED" ? (
                    <>
                      <Button
                        className="summary-primary"
                        variant="contained"
                        color="secondary"
                        onClick={async () => {
                          if (!hasAddress()) {
                            alert("Please add your delivery address in your Member profile before paying.\n\nYou'll be redirected to your profile now.");
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
                              });
                              
                              // Show success alert
                              await sweetSuccessAlert(
                                "Payment Successful!",
                                "Your order has been confirmed and is now being prepared."
                              );

                              console.log("✅ Payment successful - Order status updated to PROCESS");
                              
                              // Switch to ONGOING tab automatically
                              setActiveStatus("ONGOING");
                              
                              // Re-fetch orders to update the UI
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
                      <Button className="summary-primary" variant="contained" color="primary">
                        I received the order
                      </Button>
                      <Button className="summary-secondary" variant="outlined" onClick={() => navigate("/help")}>
                        Help / Support
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="summary-primary" variant="contained" color="secondary">
                        Order again
                      </Button>
                      <Button className="summary-secondary" variant="outlined">
                        Write a review
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
