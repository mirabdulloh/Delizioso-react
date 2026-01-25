import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";

import { NavLink } from "react-router-dom";
import "../../../css/navbar.css";

const authMember = true || null;
function HomeNavbar() {
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
              <Box className={"hover-line"}>
                <NavLink to="/order-online">Order Online</NavLink>
              </Box>
              <Box className={"hover-line"}>
                <NavLink to="/reservation">Reservation</NavLink>
              </Box>
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
              {authMember ? (
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
                  >
                    Order now
                  </Button>
                  <Button
                    className="btn-green"
                    variant="contained"
                    color="primary"
                    component={NavLink}
                    to="/reservation"
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
