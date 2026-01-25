import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import "../../../css/cs.css";
import { faq } from "../../../lib/data/faq";
import { plans } from "../../../lib/data/plans";
import ChatModal from "../../components/ChatModal";

function CS() {
  const [q, setQ] = useState("");
  const [openChat, setOpenChat] = useState(false);

  const filteredFaq = faq.filter(
    (x) =>
      x.question.toLowerCase().includes(q.toLowerCase()) ||
      x.answer.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="cs2">
      <Container >
        {/* ===== HEADER ===== */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          spacing={2}
          className="cs2-head"
        >
          <Box>
            <Box className="cs2-title">Customer Support</Box>
            <Box className="cs2-subtitle">FAQ • Announcements • Support</Box>
          </Box>
        </Stack>

        {/* ===== QUICK SUPPORT STRIP ===== */}
        <Box className="cs2-quick">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "center", md: "center" }}
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Stack direction="row" spacing={2} className="cs2-quickLeft">
              <Box className="cs2-chip">
                <LocalPhoneRoundedIcon />
                <span>Call: 02-000-0000</span>
              </Box>
              <Box className="cs2-chip">
                <EmailRoundedIcon />
                <span>Email: tursunovmirabdulla@gmail.com</span>
              </Box>
              <Box className="cs2-chip">
                <AccessTimeRoundedIcon />
                <span>Support: 10:00–22:00</span>
              </Box>
            </Stack>

            <Button
              className="cs2-cta"
              variant="contained"
              onClick={() => setOpenChat(true)}
              sx={{ ml: { xs: "auto", md: 0 } }}
            >
              Chat with support
            </Button>
          </Stack>
        </Box>

        <ChatModal open={openChat} onClose={() => setOpenChat(false)} />

        {/* ===== MAIN GRID ===== */}
        <Box className="cs2-grid">
          {/* vLEFT: FAQ */}
          <Box className="cs2-card">
            <Box className="cs2-cardTitle">FAQ</Box>

            <Box className="cs2-faq">
              {filteredFaq.map((item, idx) => (
                <Accordion key={idx} className="cs2-acc" disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreRoundedIcon />}
                    className="cs2-accSum"
                  >
                    <Box className="cs2-q">{item.question}</Box>
                  </AccordionSummary>
                  <AccordionDetails className="cs2-accDet">
                    <Box className="cs2-a">{item.answer}</Box>
                  </AccordionDetails>
                </Accordion>
              ))}

              {filteredFaq.length === 0 ? (
                <Box className="cs2-empty">
                  No results. Try: “delivery”, “cancel”, “payment”
                </Box>
              ) : null}
            </Box>
          </Box>

          {/* RIGHT: NEWS + TERMS */}
          <Stack spacing={2}>
            {/* announcements */}
            <Box className="cs2-card">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box className="cs2-cardTitle">Announcements</Box>
                <Button className="cs2-linkBtn" variant="text">
                  View all
                </Button>
              </Stack>

              <Box className="cs2-plans">
                {plans.map((p, i) => (
                  <Box key={i} className="cs2-plan">
                    <Box
                      component="img"
                      src={p.img}
                      alt={p.title}
                      className="cs2-planImg"
                    />
                    <Box className="cs2-planBody">
                      <Box className="cs2-planTitle">{p.title}</Box>
                      <Box className="cs2-planDesc">{p.desc}</Box>

                      <Stack
                        direction="row"
                        spacing={1}
                        className="cs2-planMeta"
                      >
                        <Box className="cs2-dot">{p.author}</Box>
                        <Box className="cs2-dot">{p.date}</Box>
                        <Box className="cs2-dot">{p.location}</Box>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* terms removed per request */}
          </Stack>
        </Box>
      </Container>
    </div>
  );
}

export default CS;
