import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  IconButton,
} from "@mui/material";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { resolveMediaUrl } from "../../../lib/config";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Basket from "./Basket";
import NotificationBell from "../NotificationBell";
import { CartItem } from "../../../lib/types/search";
import { scrollWindowTop } from "../../../lib/scroll";
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
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { label: "Home", to: "/" },
    { label: "Menu", to: "/products" },
    ...(authMember ? [{ label: "Order Online", to: "/order-online" }] : []),
    ...(authMember ? [{ label: "Reservation", to: "/reservation" }] : []),
    { label: "About", to: "/about" },
    { label: "Support", to: "/support" },
  ];

  const closeMobileNav = () => {
    setMobileOpen(false);
  };

  const handleNavLinkClick = (to: string) => {
    closeMobileNav();

    if (location.pathname === to) {
      scrollWindowTop();
    }
  };

  return (
    <div>
      {" "}
      <div className="other-navbar">
        <Container className="navbar-container">
          <Stack className="menu">
            <Box>
              <NavLink to="/" onClick={() => handleNavLinkClick("/")}>
                <img
                  src="/icons/Logo_Delizioso.svg"
                  alt="#"
                  className="brand-logo"
                />
              </NavLink>
            </Box>
            <Stack className="links desktop-links">
              {navigationItems.map((item) => (
                <Box className="hover-line" key={item.to}>
                  <NavLink to={item.to} onClick={() => handleNavLinkClick(item.to)}>
                    {item.label}
                  </NavLink>
                </Box>
              ))}
              {/* Basket */}
              {authMember && (
                <Basket
                  cartItems={cartItems}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onDelete={onDelete}
                  onDeleteAll={onDeleteAll}
                />
              )}
              {/* Notification Bell */}
              {authMember && <NotificationBell />}
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
                    src={
                      authMember?.memberImage
                        ? resolveMediaUrl(authMember.memberImage)
                        : "/icons/default-user.svg"
                    }
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

            <Box className="mobile-header-actions">
              {authMember && (
                <Basket
                  cartItems={cartItems}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onDelete={onDelete}
                  onDeleteAll={onDeleteAll}
                />
              )}
              {authMember && <NotificationBell />}
              {authMember && (
                <Avatar
                  className="user-avatar"
                  src={
                    authMember?.memberImage
                      ? resolveMediaUrl(authMember.memberImage)
                      : "/icons/default-user.svg"
                  }
                  alt="User"
                  onClick={onAvatarClick}
                  sx={{
                    width: 40,
                    height: 40,
                    cursor: "pointer",
                    border: "2px solid #6366f1",
                  }}
                />
              )}
              <IconButton
                className="mobile-menu-toggle"
                aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                {mobileOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
              </IconButton>
            </Box>
          </Stack>

          <Box className={`mobile-nav-panel ${mobileOpen ? "open" : ""}`}>
            <Stack className="mobile-nav-links">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="mobile-nav-link"
                  onClick={() => handleNavLinkClick(item.to)}
                >
                  {item.label}
                </NavLink>
              ))}
            </Stack>

            {!authMember && (
              <Box className="mobile-auth-buttons">
                <Button
                  color="primary"
                  variant="contained"
                  className="login-button"
                  onClick={() => {
                    closeMobileNav();
                    onLoginClick?.();
                  }}
                >
                  Login
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  className="signUp-button"
                  onClick={() => {
                    closeMobileNav();
                    onSignupClick?.();
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default OtherNavbar;
