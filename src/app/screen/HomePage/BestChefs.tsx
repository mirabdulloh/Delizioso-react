import React from "react";
import { Box, Container } from "@mui/material";
import "../../../css/home.css";

function BestChefs() {
  return (
    <div className="chef-section">
      <Container>
        {/* TITLE */}
        <Box component="h1" className="chef-title">
          Our greatest chef
        </Box>

        {/* CARDS */}
        <Box className="chef-grid">
          {/* CARD 1 */}
          <Box className="chef-card">
            <Box className="chef-img-wrap chef-bg-gray">
              <Box component="img" src="/imgs/chef1.png" className="chef-img" />
            </Box>

            <Box component="h3" className="chef-name">
              Betran Komar
            </Box>

            <Box component="p" className="chef-role">
              Head chef
            </Box>
          </Box>

          {/* CARD 2 */}
          <Box className="chef-card">
            <Box className="chef-img-wrap chef-bg-beige">
              <Box component="img" src="/imgs/chef2.png" className="chef-img" />
            </Box>

            <Box component="h3" className="chef-name">
              Ferry Sauwi
            </Box>

            <Box component="p" className="chef-role">
              Chef
            </Box>
          </Box>

          {/* CARD 3 */}
          <Box className="chef-card">
            <Box className="chef-img-wrap chef-bg-gray">
              <Box component="img" src="/imgs/chef3.png" className="chef-img" />
            </Box>

            <Box component="h3" className="chef-name">
              Iswan Droo
            </Box>

            <Box component="p" className="chef-role">
              Chef
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default BestChefs;
