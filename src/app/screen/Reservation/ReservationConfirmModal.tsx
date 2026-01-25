import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import { sweetTopSuccessAlert } from "../../../lib/sweetAlert";

type Props = {
  open: boolean;
  onClose: () => void;
  dateLabel: string;
  timeLabel: string;
  partyLabel: string;
  holdSeconds?: number;
};

export default function ReservationConfirmModal({ open, onClose, dateLabel, timeLabel, partyLabel, holdSeconds = 0 }: Props) {
  const handleConfirm = async () => {
    // Call sweet alert success
    await sweetTopSuccessAlert(`Your reservation for ${partyLabel} on ${dateLabel} at ${timeLabel} is confirmed.`);
    onClose();
  };

  const minutes = Math.floor(holdSeconds / 60);
  const seconds = holdSeconds % 60;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Reservation</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body1"><strong>Date:</strong> {dateLabel}</Typography>
          <Typography variant="body1"><strong>Time:</strong> {timeLabel}</Typography>
          <Typography variant="body1"><strong>Party size:</strong> {partyLabel}</Typography>
          <Typography variant="caption" color="text.secondary">This hold will expire in {minutes}:{String(seconds).padStart(2, '0')}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={handleConfirm}>Confirm Reservation</Button>
      </DialogActions>
    </Dialog>
  );
}
