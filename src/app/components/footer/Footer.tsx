// Footer.jsx
import React from "react";
import { Box, Container, Stack } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import "../../../css/footer.css";

function Footer() {
  return (
    <Box className="footer">
      <Container maxWidth="lg">
        <Box className="footer-inner">
          <Stack
            direction="row"
            justifyContent="space-between"
            className="footer-grid"
          >
            {/* LEFT */}
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
                <a className="footer-social-btn" href="#" aria-label="twitter">
                  <TwitterIcon />
                </a>
                <a
                  className="footer-social-btn"
                  href="#"
                  aria-label="instagram"
                >
                  <InstagramIcon />
                </a>
                <a className="footer-social-btn" href="#" aria-label="facebook">
                  <FacebookIcon />
                </a>
              </Stack>
            </Box>

            {/* PAGE */}
            <Box className="footer-col footer-col-page">
              <Box className="footer-title">Page</Box>

              <Stack spacing={2.2} className="footer-links">
                <a href="#">Home</a>
                <a href="#">Menu</a>
                <a href="/order-online">Order online</a>
                <a href="#">Catering</a>
                <a href="#">Reservation</a>
                <a href="/help">Contact us</a>
              </Stack>
            </Box>

            {/* INFO */}
            <Box className="footer-col footer-col-info">
              <Box className="footer-title">Information</Box>

              <Stack spacing={2.2} className="footer-links">
                <a href="/about">About us</a>
                <a href="#">Testimonial</a>
                <a href="#">Event</a>
                <a href="/help">Contact us</a>
              </Stack>
            </Box>

            {/* TOUCH */}
            <Box className="footer-col footer-col-touch">
              <Box className="footer-title">Get in touch</Box>

              <Stack spacing={2.2} className="footer-touch">
                <Box>3247 Johnson Ave, Bronx, NY 10463, Amerika Serikat</Box>
                <Box>delizioso@gmail.com</Box>
                <Box>+123 4567 8901</Box>
              </Stack>
            </Box>
          </Stack>

          {/* bottom */}
          <Box className="footer-bottom">Copyright © 2022 Delizioso</Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
