import React, { useEffect, useMemo, useState } from "react";
import { Box, Container } from "@mui/material";
import "../../../css/reservation.css";
import ReservationConfirmModal from "./ReservationConfirm";
import ReservationService from "../../services/ReservationService";

type Option = { label: string; value: string };

function Reservation() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState("");

  // ✅ modal
  const [openConfirm, setOpenConfirm] = useState(false);
  const [holdSeconds, setHoldSeconds] = useState(5 * 60);

  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const timeOptions: Option[] = useMemo(() => {
    const opts: Option[] = [];
    for (let h = 11; h <= 22; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 22 && m > 0) continue;
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        const v = `${hh}:${mm}`;
        opts.push({ label: v, value: v });
      }
    }
    return opts;
  }, []);

  const partyOptions: Option[] = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const n = i + 1;
      return { label: `${n} ${n === 1 ? "person" : "people"}`, value: String(n) };
    });
  }, []);

  const canSubmit = Boolean(date && time && partySize);

  // ✅ countdown when modal is open
  useEffect(() => {
    if (!openConfirm) return;

    setHoldSeconds(5 * 60); // reset on open
    const t = setInterval(() => {
      setHoldSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [openConfirm]);

  const dateLabel = useMemo(() => {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [date]);

  const timeLabel = time ? time : "—";
  const partyLabel = partySize
    ? `${partySize} people (Standard seating)`
    : "—";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      const reservationService = new ReservationService();
      const result = await reservationService.createReservation({
        date,
        time,
        partySize,
      });
      // Show confirmation modal
      setOpenConfirm(true);
      // Optionally, handle result (show success, clear form, etc)
      console.log("Reservation created:", result);
    } catch (err) {
      alert("Failed to create reservation. Please try again.");
      console.error("Reservation error:", err);
    }
  };

  const storedMemberNick = typeof window !== 'undefined' ? (localStorage.getItem('memberNick') || '') : '';

  return (
    <div className="resv">
      <Container className="resv__container">
        {/* LEFT IMAGE */}
        <Box className="resv__left">
          <Box className="resv__rings">
            <Box className="resv__ring r1" />
            <Box className="resv__ring r2" />
            <Box className="resv__ring r3" />
          </Box>

          <Box className="resv__imgWrap">
            <Box
              component="img"
              className="resv__img"
              src="/imgs/reservation-img1.png"
              alt="Restaurant table"
              onError={(e: any) => (e.currentTarget.src = "/imgs/default-food.jpg")}
            />
          </Box>
        </Box>

        {/* RIGHT FORM */}
        <Box className="resv__right">
          <Box component="h2" className="resv__title">
            Book a table
          </Box>

          <Box component="form" className="resv__form" onSubmit={onSubmit}>
            <Box component="label" className="resv__field">
              <Box component="span" className="resv__placeholder">{""}</Box>

              <Box className="resv__selectWrap">
                <Box
                  component="input"
                  className="resv__input"
                  type="date"
                  value={date}
                  min={todayStr}
                  onChange={(e: any) => setDate(e.target.value)}
                />
                <Box component="span" className="resv__chev" />
              </Box>
            </Box>

            <Box component="label" className="resv__field">
              <Box component="span" className="resv__placeholder">{""}</Box>

              <Box className="resv__selectWrap">
                <Box
                  component="select"
                  className="resv__select"
                  value={time}
                  onChange={(e: any) => setTime(e.target.value)}
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  {timeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Box>
                <Box component="span" className="resv__chev" />
              </Box>
            </Box>

            <Box component="label" className="resv__field">
              <Box component="span" className="resv__placeholder">{""}</Box>

              <Box className="resv__selectWrap">
                <Box
                  component="select"
                  className="resv__select"
                  value={partySize}
                  onChange={(e: any) => setPartySize(e.target.value)}
                >
                  <option value="" disabled>
                    Select party size
                  </option>
                  {partyOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Box>
                <Box component="span" className="resv__chev" />
              </Box>
            </Box>

            <Box component="button" className="resv__btn" type="submit" disabled={!canSubmit}>
              Book now
            </Box>

            <Box component="p" className={`resv__hint ${canSubmit ? "ok" : ""}`} sx={{ m: 0 }}>
              {canSubmit ? "Ready to book." : "Select date, time, and party size to continue."}
            </Box>
          </Box>
        </Box>
      </Container>

      {/* ✅ POPUP */}
      <ReservationConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        dateLabel={dateLabel}
        timeLabel={timeLabel}
        partyLabel={partyLabel}
        holdSeconds={holdSeconds}
        memberNick={storedMemberNick}
      />
    </div>
  );
}

export default Reservation;
