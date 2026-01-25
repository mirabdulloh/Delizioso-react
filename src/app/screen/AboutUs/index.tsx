import React from "react";
import { Box, Container, Stack } from "@mui/material";
import "../../../css/about.css";

function AboutUs() {
  return (
    <div className="about2">
      <Container className="about2-container">
        {/* ===== SECTION 1 ===== */}
        <Box className="about2-section">
          {/* LEFT IMAGE */}
          <Box className="about2-imgBlock">
            <Box className="about2-ring ring-lg" />
            <Box className="about2-ring ring-md" />
            <Box className="about2-imgWrap big">
              <Box
                component="img"
                src="/imgs/about1.png"
                alt="Restaurant"
                className="about2-img"
              />
            </Box>
          </Box>

          {/* RIGHT TEXT */}
          <Box className="about2-textBlock">
            <Box className="about2-kicker orange">Our</Box>
            <Box className="about2-title">
              restaurant
            </Box>

            <Box className="about2-paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Box>

            <Box className="about2-paragraph">
              Duis aute irure dolor in reprehenderit in voluptate velit esse.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </Box>
          </Box>
        </Box>

        {/* ===== SECTION 2 (reverse) ===== */}
        <Box className="about2-section reverse">
          {/* LEFT TEXT */}
          <Box className="about2-miniText">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit.
          </Box>

          {/* RIGHT IMAGE */}
          <Box className="about2-imgBlock">
            <Box className="about2-ring ring-lg" />
            <Box className="about2-ring ring-md" />
            <Box className="about2-imgWrap">
              <Box
                component="img"
                src="/imgs/about2.png"
                alt="Food"
                className="about2-img"
              />
            </Box>
          </Box>
        </Box>

        {/* ===== SECTION 3 ===== */}
        <Box className="about2-section chef">
          {/* LEFT CHEF IMAGE */}
          <Box className="about2-chefImg">
            <Box
              component="img"
              src="/imgs/about3.png"
              alt="Chef"
              className="about2-chefPhoto"
            />
          </Box>

          {/* RIGHT CHEF INFO */}
          <Box className="about2-chefInfo">
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Box className="about2-kicker orange">Owner</Box>
              <Box className="about2-kicker dark">&amp;</Box>
            </Stack>

            <Box className="about2-title">Executive Chef</Box>
            <Box className="about2-name">Ismail Marzuki</Box>

            <Box className="about2-quote">
              <span className="qmark left">“</span>
              <Box className="about2-quoteText">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Box>
              <span className="qmark right">”</span>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default AboutUs;
