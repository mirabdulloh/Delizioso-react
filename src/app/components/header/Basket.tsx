import React from "react";
import { Box, Button, Stack, Typography, IconButton, Divider } from "@mui/material";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const navigate = useNavigate();
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const shippingCost: number = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(2);

  /** MENU CONTROL **/
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const proceedOrderHandler = async () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);
      const order = new OrderService();
      await order.createOrder(cartItems);

      onDeleteAll();
      setOrderBuilder(new Date());
      navigate("/order-online");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box className={"hover-line"}>
      <IconButton
        aria-label="cart"
        id="basket-button"
        aria-controls={open ? "basket-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <Badge 
          badgeContent={cartItems?.length} 
          color="secondary"
          sx={{
            "& .MuiBadge-badge": {
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              fontWeight: 700,
              color: "#fff",
            },
          }}
        >
          <ShoppingCartIcon sx={{ color: "#333", fontSize: 28 }} />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        id="basket-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 420,
            maxHeight: 600,
            borderRadius: "20px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            mt: 1.5,
            overflow: "visible",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              border: "1px solid rgba(0, 0, 0, 0.05)",
              borderRight: "none",
              borderBottom: "none",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack sx={{ p: 2.5 }}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Shopping Cart
            </Typography>
            {cartItems?.length > 0 && (
              <IconButton
                onClick={onDeleteAll}
                size="small"
                sx={{
                  color: "#ef4444",
                  "&:hover": {
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                  },
                }}
              >
                <DeleteForeverIcon />
              </IconButton>
            )}
          </Stack>

          {/* Cart Items */}
          {cartItems?.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
              }}
            >
              <ShoppingCartIcon
                sx={{
                  fontSize: 64,
                  color: "#e0e0e0",
                  mb: 2,
                }}
              />
              <Typography
                sx={{
                  color: "#999",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                Your cart is empty
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2} sx={{ maxHeight: 360, overflowY: "auto", mb: 2 }}>
              {cartItems?.map((item: CartItem) => {
                const imgPath = `${serverApi}/${item.image}`;
                return (
                  <Box
                    key={item._id}
                    sx={{
                      position: "relative",
                      display: "flex",
                      gap: 2,
                      p: 1.5,
                      borderRadius: "16px",
                      backgroundColor: "#f8f9fa",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f0f1f3",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {/* Close Button */}
                    <IconButton
                      onClick={() => onDelete(item)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        width: 24,
                        height: 24,
                        color: "#999",
                        "&:hover": {
                          color: "#ef4444",
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>

                    {/* Image */}
                    <Box
                      component="img"
                      src={imgPath}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "12px",
                        objectFit: "cover",
                      }}
                    />

                    {/* Details */}
                    <Stack flex={1} spacing={0.5}>
                      <Typography
                        sx={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#1a1a1a",
                          pr: 3,
                        }}
                      >
                        {item.name}
                      </Typography>
                      
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#6366f1",
                        }}
                      >
                        ₩{item.price.toFixed(2)}
                      </Typography>

                      {/* Quantity Controls */}
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                        <IconButton
                          onClick={() => onRemove(item)}
                          size="small"
                          sx={{
                            width: 28,
                            height: 28,
                            backgroundColor: "#fff",
                            border: "1.5px solid #e0e0e0",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                              borderColor: "#6366f1",
                            },
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        
                        <Typography
                          sx={{
                            minWidth: 32,
                            textAlign: "center",
                            fontSize: "15px",
                            fontWeight: 600,
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        
                        <IconButton
                          onClick={() => onAdd(item)}
                          size="small"
                          sx={{
                            width: 28,
                            height: 28,
                            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                            color: "#fff",
                            "&:hover": {
                              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                            },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}

          {/* Summary */}
          {cartItems.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#666", fontSize: "14px" }}>
                    Subtotal
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                    ₩{itemsPrice.toFixed(2)}
                  </Typography>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ color: "#666", fontSize: "14px" }}>
                    Shipping
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                    ₩{shippingCost.toFixed(2)}
                  </Typography>
                </Stack>
                
                <Divider />
                
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: "18px", fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₩{totalPrice}
                  </Typography>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={proceedOrderHandler}
                  sx={{
                    mt: 2,
                    borderRadius: "12px",
                    padding: "14px",
                    fontSize: "16px",
                    fontWeight: 700,
                    textTransform: "none",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.35)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      boxShadow: "0 8px 25px rgba(99, 102, 241, 0.45)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Menu>
    </Box>
  );
}
