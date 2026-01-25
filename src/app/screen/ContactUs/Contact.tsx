import React from "react";
import { Box, Container, Stack, TextField, Button } from "@mui/material";
import "../../../css/contact.css";

function Contact() {
  return (
    <div className="contact2">
      <Container  className="contact2-container">
        {/* ===== HEADER ===== */}
        <Box className="contact2-title">Contact us</Box>
        <Box className="contact2-subtitle">
          We love hearing from our customers — feel free to share your experience
          or ask any questions you may have.
        </Box>

        {/* ===== FORM ===== */}
        <Box className="contact2-formWrap">
          <Box className="contact2-formCard">
            <Box className="contact2-formGrid">
              <TextField
                placeholder="First name"
                variant="outlined"
                className="contact2-input"
              />
              <TextField
                placeholder="Last name"
                variant="outlined"
                className="contact2-input"
              />

              <TextField
                placeholder="Email address"
                variant="outlined"
                className="contact2-input"
              />
              <TextField
                placeholder="Subject"
                variant="outlined"
                className="contact2-input"
              />

              <TextField
                placeholder="Message"
                variant="outlined"
                className="contact2-input contact2-message"
                multiline
                rows={6}
              />
           
            </Box>

            <Stack direction="row" justifyContent="center" mt={3}>
              <Button className="contact2-submit" variant="contained">
                Submit
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* ===== MAP (IFRAME) ===== */}
      <Box className="contact2-mapWrap">
        <iframe
          title="Deliziso Restaurant Location"
          className="contact2-map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Seoul%20City%20Hall&output=embed"
        />

        {/* overlay card like your screenshot */}
        <Box className="contact2-mapOverlay">
          <Box className="contact2-mapMini">
            <Box
              component="img"
              src="/imgs/deafult_img.jpg"
              alt="Restaurant"
              className="contact2-mapThumb"
            />
            <Box className="contact2-mapInfo">
              <Box className="contact2-mapName">Deliziso Restaurant</Box>
              <Box className="contact2-mapMeta">
                Seoul, Republic of Korea
              </Box>
              <Box className="contact2-mapMeta">
                37.5665, 126.9780
              </Box>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} className="contact2-mapBtns">
            <Button className="contact2-mapBtn dark" variant="contained">
              ↗
            </Button>
            <Button className="contact2-mapBtn orange" variant="contained">
              ✕
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  );
}

export default Contact;
