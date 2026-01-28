import React from "react";
import { Box, Button, Container, Stack, Menu, MenuItem } from "@mui/material";

import { NavLink } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/navbar.css";

interface OtherNavbarProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  anchorEl?: HTMLElement | null;
  onAvatarClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  onLogoutMenuClose?: () => void;
  onLogoutRequest?: () => void;
}

function OtherNavbar({ onLoginClick, onSignupClick, anchorEl, onAvatarClick, onLogoutMenuClose, onLogoutRequest }: OtherNavbarProps = {}) {
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
              {/* {Basket} */}
              {/* <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              /> */}
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
                  <img
                    className="user-avatar"
                    src="/imgs/default_img.jpg"
                    alt="#"
                    role="button"
                    aria-haspopup={"true"}
                    onClick={onAvatarClick}
                  />
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={onLogoutMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        onLogoutRequest?.();
                        onLogoutMenuClose?.();
                      }}
                    >
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
