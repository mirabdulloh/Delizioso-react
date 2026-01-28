import React from "react";
import { Box, Button, Container, Stack, Menu, MenuItem, Avatar, Divider, ListItemIcon } from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import "../../../css/navbar.css";

interface OtherNavbarProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  anchorEl?: HTMLElement | null;
  onAvatarClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onLogoutMenuClose?: () => void;
  onLogoutRequest?: () => void;
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

function OtherNavbar({ onLoginClick, onSignupClick, anchorEl, onAvatarClick, onLogoutMenuClose, onLogoutRequest, cartItems, onAdd, onRemove, onDelete, onDeleteAll }: OtherNavbarProps) {
  const { authMember } = useGlobals();
  const navigate = useNavigate();
  return (
    <div>
      {" "}
      <div className="home-navbar">
        <Container className="navbar-container">
          <Stack className="menu">
            <Box>
              <NavLink to="/">
                <img
                  src="/icons/Logo_Delizioso.svg"
                  alt="#"
                  className="brand-logo"
                />
              </NavLink>
            </Box>
            <Stack className="links">
              <Box className={"hover-line"}>
                <NavLink to="/">Home</NavLink>
              </Box>
              <Box className={"hover-line"}>
                <NavLink to="/products">Menu</NavLink>
              </Box>
              <Box className={"hover-line"}>
                <NavLink to="/about">About</NavLink>
              </Box>
              <Box className={"hover-line"}>
                <NavLink to="/support">Support</NavLink>
              </Box>
              {authMember && (
                <Box className={"hover-line"}>
                  <NavLink to="/order-online">Order Online</NavLink>
                </Box>
              )}
              {authMember && (
                <Box className={"hover-line"}>
                  <NavLink to="/reservation">Reservation</NavLink>
                </Box>
              )}
              <Box className={"hover-line"}>
                <NavLink to="/help">Contact</NavLink>
              </Box>
              {/* Basket */}
              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />
              {!authMember ? (
                <Box className="auth-buttons">
                  <Box>
                    <Button
                      color="primary"
                      variant="contained"
                      className="login-button"
                      onClick={onLoginClick}
                    >
                      Login
                    </Button>
                  </Box>

                  <Box>
                    <Button
                      color="secondary"
                      variant="contained"
                      className="signUp-button"
                      onClick={onSignupClick}
                    >
                      Sign Up
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Avatar
                    className="user-avatar"
                    src="/imgs/default_img.jpg"
                    alt="User"
                    onClick={onAvatarClick}
                    sx={{
                      width: 45,
                      height: 45,
                      cursor: "pointer",
                      border: "2px solid #6366f1",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                      },
                    }}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={onLogoutMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: "16px",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        "& .MuiMenuItem-root": {
                          px: 2.5,
                          py: 1.5,
                          borderRadius: "12px",
                          mx: 1,
                          my: 0.5,
                          fontSize: "15px",
                          fontWeight: 500,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(99, 102, 241, 0.08)",
                            transform: "translateX(4px)",
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        navigate("/member-page");
                        onLogoutMenuClose?.();
                      }}
                    >
                      <ListItemIcon>
                        <AccountCircleIcon
                          fontSize="small"
                          sx={{ color: "#6366f1" }}
                        />
                      </ListItemIcon>
                      My Profile
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                      onClick={() => {
                        onLogoutRequest?.();
                        onLogoutMenuClose?.();
                      }}
                      sx={{
                        color: "#ef4444",
                        "&:hover": {
                          backgroundColor: "rgba(239, 68, 68, 0.08) !important",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" sx={{ color: "#ef4444" }} />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </div>
    </div>
  );
}

export default OtherNavbar;
