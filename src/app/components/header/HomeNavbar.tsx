import React from "react";
import { Box, Button, Container, Stack, Menu, MenuItem, Avatar, Divider, ListItemIcon } from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetFailureProvider } from "../../../lib/sweetAlert";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import "../../../css/navbar.css";

interface HomeNavbarProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  anchorEl?: HTMLElement | null;
  onAvatarClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  onLogoutMenuClose?: () => void;
  onLogoutRequest?: () => void;
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

function HomeNavbar({ onLoginClick, onSignupClick, anchorEl, onAvatarClick, onLogoutMenuClose, onLogoutRequest, cartItems, onAdd, onRemove, onDelete, onDeleteAll }: HomeNavbarProps) {
  const navigate = useNavigate();
  const { authMember } = useGlobals();
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
                <NavLink to="/about">About</NavLink>
              </Box>
              <Box className={"hover-line"}>
                <NavLink to="/support">Support</NavLink>
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
                        navigate("/my-page");
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

          <Box className="hero">
            <Box className="hero-grid">
              {/* LEFT */}
              <Box className="hero-left">
                <Box className="hero-pill">Restaurant</Box>

                <Box className="hero-title" component="h1">
                  Italian <br /> Cuisine
                </Box>

                <Box className="hero-desc">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Sodales senectus dictum arcu sit tristique donec eget.
                </Box>

                <Stack direction="row" spacing={2} className="hero-actions">
                  <Button
                    className="btn-orange"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      if (authMember) navigate("/order-online");
                      else sweetFailureProvider("Please sign up first to order.", true);
                    }}
                  >
                    Order now
                  </Button>
                  
                  <Button
                    className="btn-green"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (authMember) navigate("/reservation");
                      else sweetFailureProvider("Please sign up first to make a reservation.", true);
                    }}
                  >
                    Reservation
                  </Button>
                </Stack>
              </Box>

              {/* RIGHT */}
              <Box className="hero-right">
                <Box
                  component="img"
                  className="img img-main"
                  src="/imgs/header-img1.png"
                />

                <Box
                  component="img"
                  className="img img-left"
                  src="/imgs/header-img2.png"
                />

                <Box
                  component="img"
                  className="img img-bottom"
                  src="/imgs/header-img3.jpg"
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default HomeNavbar;
