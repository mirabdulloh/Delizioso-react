import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Stack,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import "../../../css/reservation.css";

type Props = {
  open: boolean;
  onClose: () => void;
  dateLabel: string;
  timeLabel: string;
  partyLabel: string;
  holdSeconds: number;
  onConfirm?: (note: string, name: string, email: string, phone: string) => void;
  memberNick?: string;
  note?: string;
  email?: string;
  phone?: string;
};

export default function ReservationConfirmModal({
  open,
  onClose,
  dateLabel,
  timeLabel,
  partyLabel,
  holdSeconds,
  onConfirm,
  memberNick,
  note: noteProp,
  email: emailProp,
  phone: phoneProp,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const mm = String(Math.floor(holdSeconds / 60)).padStart(2, "0");
  const ss = String(holdSeconds % 60).padStart(2, "0");

  const handleConfirm = async () => {
    if (formValid) {
      await onConfirm?.(note, firstName, emailState, phoneState);
    }
    onClose();
  };

  // form state
  const [firstName, setFirstName] = React.useState(memberNick || "");
  const [phoneState, setPhoneState] = React.useState(phoneProp || "");
  const [emailState, setEmailState] = React.useState(emailProp || "");
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [agreeNews, setAgreeNews] = React.useState(false);
  const [note, setNote] = React.useState(noteProp || "");

  React.useEffect(() => {
    if (memberNick) setFirstName(memberNick);
  }, [memberNick]);

  const isKoreanPhone = (v: string) => {
    const digits = v.replace(/\D/g, "");
    // Accepts numbers that start with 0 (local) or start with 82 (country code)
    if (!/^(?:0|82)/.test(digits)) return false;
    return digits.length >= 9 && digits.length <= 11;
  };

  const isEmailValid = (v: string) => /\S+@\S+\.\S+/.test(v);

  const formValid = Boolean(
    firstName &&
    phoneState &&
    emailState &&
    agreeTerms &&
    agreeNews &&
    isKoreanPhone(phoneState) &&
    isEmailValid(emailState),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth="md"
      PaperProps={{
        className: "resv2-modalPaper",
        sx: {
          m: { xs: 0, sm: 2 },
          width: { xs: "100%", sm: "auto" },
          maxWidth: { xs: "100%", sm: "calc(100vw - 32px)" },
          maxHeight: { xs: "100%", sm: "min(92vh, 900px)" },
          borderRadius: { xs: 0, sm: 4 },
        },
      }}
    >
      <DialogContent
        className="resv2-modal"
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          overflowY: "auto",
        }}
      >
        <IconButton className="resv2-close" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>

        {/* top avatar */}
        <Box className="resv2-hero">
          <Box
            component="img"
            className="resv2-heroImg"
            src="/imgs/default_img.jpg"
            alt="Table"
            onError={(e: any) =>
              (e.currentTarget.src = "/imgs/default_img.jpg")
            }
          />
        </Box>

        <Box className="resv2-title">Reservation detail</Box>

        {/* info row */}
        <Stack
          className="resv2-meta"
          direction="row"
          spacing={3}
          flexWrap="wrap"
        >
          <Box className="resv2-metaItem">
            <CalendarMonthRoundedIcon />
            <span>{dateLabel}</span>
          </Box>
          <Box className="resv2-metaItem">
            <AccessTimeRoundedIcon />
            <span>{timeLabel}</span>
          </Box>
          <Box className="resv2-metaItem">
            <PeopleAltRoundedIcon />
            <span>{partyLabel}</span>
          </Box>
        </Stack>

        {/* hold banner */}
        <Box className="resv2-hold">
          Due to limited availability, we can hold this table for you for{" "}
          <b>
            {mm}:{ss}
          </b>
        </Box>

        <Box className="resv2-sectionTitle">Data order</Box>

        {/* form grid */}
        <Box className="resv2-grid">
          <TextField
            placeholder="First name"
            className="resv2-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <TextField
            placeholder="Phone number"
            className="resv2-input"
            value={phoneState}
            onChange={(e) => setPhoneState(e.target.value.replace(/[^\d+]/g, ""))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneRoundedIcon />
                </InputAdornment>
              ),
            }}
            error={phoneState.length > 0 && !isKoreanPhone(phoneState)}
            helperText={
              phoneState.length > 0 && !isKoreanPhone(phoneState)
                ? "Enter a valid Korean phone number"
                : ""
            }
            required
          />

          <TextField
            placeholder="Email address"
            className="resv2-input"
            value={emailState}
            onChange={(e) => setEmailState(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailRoundedIcon />
                </InputAdornment>
              ),
            }}
            error={emailState.length > 0 && !isEmailValid(emailState)}
            helperText={
              emailState.length > 0 && !isEmailValid(emailState)
                ? "Enter a valid email"
                : ""
            }
            required
          />

          <TextField
            placeholder="Add a note for your reservation"
            className="resv2-input"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </Box>

        {/* checks + restaurant info */}
        <Box className="resv2-bottom">
          <Box className="resv2-checks">
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
              }
              label="I agree with what is stated above"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreeNews}
                  onChange={(e) => setAgreeNews(e.target.checked)}
                />
              }
              label="Sign me up to receive dining offers and news from this restaurant by email."
            />
          </Box>

          <Box className="resv2-info">
            <Box className="resv2-infoTitle">Restaurant informations</Box>
            <Box className="resv2-infoText">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
              <br />
              <br />
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit, sed quia non numquam eius modi tempor
              incidunt ut labore et dolore magnam aliquam.
            </Box>
          </Box>
        </Box>

        <Button
          className="resv2-confirm"
          variant="contained"
          onClick={handleConfirm}
          disabled={!formValid}
        >
          Confirm reservation
        </Button>
      </DialogContent>
    </Dialog>
  );
}
