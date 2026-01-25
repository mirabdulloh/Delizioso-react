import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";

import { NavLink } from "react-router-dom";
import "../../../css/navbar.css";

function OtherNavbar() {
  const authMember = typeof window !== "undefined" && Boolean(localStorage.getItem("memberNick"));
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
                      onClick={() => true}
                    >
                      Login
                    </Button>
                  </Box>

                  <Box>
                    <Button
                      color="secondary"
                      variant="contained"
                      className="signUp-button"
                      onClick={() => true}
                    >
                      Sign Up
                    </Button>
                  </Box>
                </Box>
              ) : (
                <img
                  className="user-avatar"
                  src="/imgs/default_img.jpg"
                  alt="#"
                  role="button"
                  aria-haspopup={"true"}
                />
              )}
            </Stack>
          </Stack>
        </Container>
      </div>
    </div>
  );
}

export default OtherNavbar;
