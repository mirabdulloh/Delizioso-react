import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

import { NavLink } from "react-router-dom";
import "../../../css/navbar.css";

const authMember = true || null;
function Navbar() {
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
              {authMember ? (
                <Box className={"hover-line"}>
                  <NavLink to="/orders">Order online</NavLink>
                </Box>
              ) : null}
              {authMember ? (
                <Box className={"hover-line"}>
                  <NavLink to="/member-page">Reservation</NavLink>
                </Box>
              ) : null}
              <Box className={"hover-line"}>
                <NavLink to="/help">Contact us</NavLink>
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
            <Container className="hero-container" maxWidth="lg">
              <Box className="hero-grid">
                {/* LEFT */}
                <Box className="hero-left">
                  <Box className="hero-pill">Restaurant</Box>

                  <Typography className="hero-title" component="h1">
                    Italian <br /> Cuisine
                  </Typography>

                  <Typography className="hero-desc">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Sodales senectus dictum arcu sit tristique donec eget.
                  </Typography>

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
                    >
                      Reservation
                    </Button>
                  </Stack>
                </Box>

                {/* RIGHT */}
                <Box className="hero-right">
                  <Box
                    className="hero-img"
                    component="img"
                    src="/imgs/hero-pasta.png"
                    alt="Italian cuisine"
                  />
                </Box>
              </Box>
            </Container>
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default Navbar;
