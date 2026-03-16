import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { sweetFailureProvider } from "../../../lib/sweetAlert";
import "../../../css/home.css";

interface ReserveTableProps {
  onLoginClick?: () => void;
}

function ReserveTable({ onLoginClick }: ReserveTableProps = {}) {
  const navigate = useNavigate();
  const { authMember } = useGlobals();

  const handleReserveClick = () => {
    if (authMember) navigate('/reservation');
    else {
      sweetFailureProvider('Please login first to make a reservation.', true);
      onLoginClick?.();
    }
  };

  return (
    <div className="reservation-section">
      <Container className="reservation-container">
        {/* LEFT */}
        <Stack className="reservation-left">
          {/* BACK BIG OUTLINE CIRCLE */}
          <Box className="reservation-outline" />

          {/* BIG IMAGE RING */}
          <Box className="reservation-ring big">
            <Box className="reservation-inner">
              <Box
                component="img"
                src="/imgs/reservation-img1.png"
                className="reservation-img"
                alt="Reservation"
              />
            </Box>
          </Box>

          {/* SMALL TOP */}
          <Box className="reservation-ring small top">
            <Box className="reservation-inner small-inner">
              <Box
                component="img"
                src="/imgs/reservation-top.png"
                className="reservation-img"
                alt="Top"
              />
            </Box>
          </Box>

          {/* SMALL BOTTOM */}
          <Box className="reservation-ring small bottom">
            <Box className="reservation-inner small-inner">
              <Box
                component="img"
                src="/imgs/reservation-bottom.png"
                className="reservation-img"
                alt="Bottom"
              />
            </Box>
          </Box>
        </Stack>

        {/* RIGHT */}
        <Stack className="reservation-right">
          <Box component="h1" className="reservation-title">
            Let's reserve <span>a table</span>
          </Box>

          <Box component="p" className="reservation-desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis
            ultricies at eleifend proin.
          </Box>

          <Button
            variant="contained"
            className="reservation-btn"
            color="secondary"
            sx={{
              width: { xs: "min(100%, 260px)", sm: "min(100%, 232px)" },
              maxWidth: "100%",
              minHeight: { xs: 52, sm: 58 },
              px: { xs: 3, sm: 4 },
              fontSize: { xs: "0.95rem", sm: "1rem" },
              whiteSpace: "nowrap",
            }}
            onClick={handleReserveClick}
          >
            Reservation
          </Button>
        </Stack>
      </Container>
    </div>
  );
}

export default ReserveTable;
