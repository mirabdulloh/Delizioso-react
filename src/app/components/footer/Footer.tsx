import React from "react";
import { Box, Container, Stack } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { NavLink } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetFailureProvider } from "../../../lib/sweetAlert";
import "../../../css/footer.css";

interface FooterProps {
  onLoginClick?: () => void;
}

function Footer({ onLoginClick }: FooterProps = {}) {
  const { authMember } = useGlobals();

  return (
    <Box className="footer">
      <Container maxWidth="lg">
        <Box className="footer-inner">
          <Box className="footer-grid">
            <Box className="footer-left">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box className="footer-logo-circle">D</Box>
                <Box className="footer-logo-text">Delizioso</Box>
              </Stack>

              <Box className="footer-desc">
                Viverra gravida morbi egestas facilisis tortor netus non duis
                tempor.
              </Box>

              <Stack direction="row" spacing={2.2} className="footer-socials">
                <a
                  className="footer-social-btn"
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="twitter"
                >
                  <TwitterIcon />
                </a>
                <a
                  className="footer-social-btn"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  className="footer-social-btn"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="facebook"
                >
                  <FacebookIcon />
                </a>
              </Stack>
            </Box>

            <Box className="footer-col footer-col-page">
              <Box className="footer-title">Page</Box>

              <Stack spacing={2.2} className="footer-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">Menu</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/support">Support</NavLink>
                <NavLink
                  to="/order-online"
                  onClick={(e: any) => {
                    if (!authMember) {
                      e.preventDefault();
                      sweetFailureProvider(
                        "Please login first to order.",
                        true,
                      );
                      onLoginClick?.();
                    }
                  }}
                >
                  Order Online
                </NavLink>
                <NavLink
                  to="/reservation"
                  onClick={(e: any) => {
                    if (!authMember) {
                      e.preventDefault();
                      sweetFailureProvider(
                        "Please login first to make a reservation.",
                        true,
                      );
                      onLoginClick?.();
                    }
                  }}
                >
                  Reservation
                </NavLink>
                <NavLink to="/help">Contact</NavLink>
              </Stack>
            </Box>

            <Box className="footer-col footer-col-info">
              <Box className="footer-title">Information</Box>

              <Stack spacing={2.2} className="footer-links">
                <a href="/about">About us</a>
                <a href="/support">Testimonial</a>
                <a href="/support">Event</a>
                <a href="/support">Contact us</a>
              </Stack>
            </Box>

            <Box className="footer-col footer-col-touch">
              <Box className="footer-title">Get in touch</Box>

              <Stack spacing={2.2} className="footer-touch">
                <Box>3247 Johnson Ave, Bronx, NY 10463, Amerika Serikat</Box>
                <Box>delizioso@gmail.com</Box>
                <Box>+123 4567 8901</Box>
              </Stack>
            </Box>
          </Box>

          <Box className="footer-bottom">Copyright © 2022 Delizioso</Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
