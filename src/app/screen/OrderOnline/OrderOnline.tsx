import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Stack, Button, IconButton, Rating, Divider } from "@mui/material";

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

type OrderStatus = "PAUSED" | "ONGOING" | "FINISHED";

type OrderItem = {
  id: string;
  name: string;
  img: string;
  price: number;
  qty: number;
};

type Order = {
  id: string;
  status: OrderStatus;
  restaurant: string;
  createdAt: string;
  etaMin?: number;
  items: OrderItem[];
};

function calcSubtotal(items: OrderItem[]) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

function OrderOnline() {
  const navigate = useNavigate();

  const memberRoute = "/";

  const hasAddress = () => Boolean(localStorage.getItem("userAddress"));
  const [activeStatus, setActiveStatus] = useState<OrderStatus>("PAUSED");
  const [selectedId, setSelectedId] = useState<string>("o1");

  const orders = useMemo<Order[]>(
    () => [
      {
        id: "o1",
        status: "PAUSED",
        restaurant: "Delizioso Restaurant • Seoul",
        createdAt: "Today, 14:05",
        items: [
          { id: "i1", name: "Spaghetti", img: "/imgs/pastas.jpg", price: 12.05, qty: 2 },
          { id: "i2", name: "Truffle Pasta", img: "/imgs/pastas.jpg", price: 13.0, qty: 1 },
        ],
      },
      {
        id: "o2",
        status: "ONGOING",
        restaurant: "Delizioso Restaurant • Seoul",
        createdAt: "Today, 13:10",
        etaMin: 23,
        items: [{ id: "i3", name: "Signature Pizza", img: "/imgs/pastas.jpg", price: 13.2, qty: 1 }],
      },
      {
        id: "o3",
        status: "FINISHED",
        restaurant: "Delizioso Restaurant • Seoul",
        createdAt: "Yesterday, 20:40",
        items: [
          { id: "i4", name: "Chef Pasta", img: "/imgs/pastas.jpg", price: 14.9, qty: 1 },
          { id: "i5", name: "Caesar salad", img: "/imgs/pastas.jpg", price: 8.5, qty: 1 },
        ],
      },
    ],
    []
  );

  const filtered = orders.filter((o) => o.status === activeStatus);
  const selectedOrder = orders.find((o) => o.id === selectedId) ?? filtered[0] ?? orders[0];

  const visibleSelected =
    selectedOrder && selectedOrder.status === activeStatus ? selectedOrder : filtered[0] ?? null;

  const subtotal = visibleSelected ? calcSubtotal(visibleSelected.items) : 0;
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
                  {visibleSelected.items.map((it) => (
                    <Box key={it.id} className="summary-item">
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Box component="img" src={it.img} alt={it.name} className="summary-img" />
                        <Box className="summary-name">{it.name}</Box>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        {activeStatus === "PAUSED" ? (
                          <Stack direction="row" spacing={0.6} alignItems="center" className="summary-qty">
                            <IconButton className="summary-qtyBtn">
                              <RemoveRoundedIcon />
                            </IconButton>
                            <Box className="summary-qtyNum">{it.qty}</Box>
                            <IconButton className="summary-qtyBtn">
                              <AddRoundedIcon />
                            </IconButton>
                          </Stack>
                        ) : (
                          <Box className="summary-qtyText">x{it.qty}</Box>
                        )}

                        <Box className="summary-price">${(it.price * it.qty).toFixed(2)}</Box>

                        {activeStatus === "PAUSED" ? (
                          <IconButton className="summary-del">
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
                        onClick={() => {
                          if (!hasAddress()) {
                            window.alert("Please add your delivery address in Member page before paying.");
                            navigate(memberRoute);
                            return;
                          }
                          window.alert("Proceeding to payment (demo)");
                        }}
                      >
                        Pay now
                      </Button>
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
