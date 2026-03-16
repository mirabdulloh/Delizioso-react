import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import { useDispatch } from "react-redux";
import { clearCache } from "../../screen/MenuPage/slice";
import { clearLikesCache } from "../../screen/MenuPage/likesSlice";

const GlassModal = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(440px, calc(100vw - 32px))",
  maxHeight: "min(90vh, 760px)",
  overflowY: "auto",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  borderRadius: "30px",
  padding: "50px 40px",
  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  outline: "none",
  animation: "slideIn 0.4s ease-out",
  scrollbarWidth: "thin",
  overscrollBehavior: "contain",
  "@keyframes slideIn": {
    from: {
      opacity: 0,
      transform: "translate(-50%, -45%)",
    },
    to: {
      opacity: 1,
      transform: "translate(-50%, -50%)",
    },
  },
  [theme.breakpoints.down("md")]: {
    padding: "42px 32px",
    borderRadius: "26px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "calc(100vw - 24px)",
    maxHeight: "calc(100vh - 24px)",
    padding: "36px 20px 24px",
    borderRadius: "24px",
  },
}));

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: "20px",
  top: "20px",
  width: "40px",
  height: "40px",
  background: "rgba(0, 0, 0, 0.04)",
  color: "#666",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    transform: "rotate(90deg)",
  },
  [theme.breakpoints.down("sm")]: {
    top: "14px",
    right: "14px",
    width: "36px",
    height: "36px",
  },
}));

const GlassTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "16px",
    fontSize: "15px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.95)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
    },
    "&.Mui-focused": {
      background: "#fff",
      boxShadow: "0 8px 30px rgba(99, 102, 241, 0.15)",
      transform: "translateY(-2px)",
    },
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.08)",
      borderWidth: "1.5px",
    },
    "&:hover fieldset": {
      borderColor: "rgba(99, 102, 241, 0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6366f1",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#6366f1",
      fontWeight: 600,
    },
  },
});

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  borderRadius: "16px",
  padding: "16px 32px",
  minHeight: "54px",
  fontSize: "16px",
  fontWeight: 700,
  textTransform: "none",
  color: "#fff",
  boxShadow: "0 8px 25px rgba(99, 102, 241, 0.35)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "none",
  "&:hover": {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    boxShadow: "0 12px 35px rgba(99, 102, 241, 0.45)",
    transform: "translateY(-3px) scale(1.02)",
  },
  "&:active": {
    transform: "translateY(-1px) scale(0.98)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "14px 24px",
    minHeight: "50px",
    fontSize: "15px",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "60px",
  height: "60px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  boxShadow: "0 8px 25px rgba(99, 102, 241, 0.35)",
  margin: "0 auto 10px",
  "& svg": {
    fontSize: "32px",
    color: "#fff",
  },
  [theme.breakpoints.down("sm")]: {
    width: "52px",
    height: "52px",
    borderRadius: "18px",
    "& svg": {
      fontSize: "28px",
    },
  },
}));

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setAuthMember } = useGlobals();

  /** HANDLERS **/
  const handleUserName = (e: any) => {
    setMemberNick(e.target.value);
  };

  const handleUserPhone = (e: any) => {
    setMemberPhone(e.target.value);
  };

  const handleUserPassword = (e: any) => {
    setMemberPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordKeyDown = (e: any) => {
    if (e.key === "Enter" && signupOpen) {
      handleSignupRequest().then();
    } else if (e.key === "Enter" && loginOpen) {
      handleLoginRequest().then();
    }
  };

  const handleSignupRequest = async () => {
    try {
      const isFullfilled =
        memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFullfilled) {
        throw new Error(Messages.error3);
      }

      const input: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const memberService = new MemberService();
      const result = await memberService.signup(input);
      setAuthMember(result);
      dispatch(clearCache()); // Clear product cache when new user signs up
      dispatch(clearLikesCache()); // Clear likes cache when new user signs up
      handleSignupClose();
      setMemberNick("");
      setMemberPhone("");
      setMemberPassword("");
      setShowPassword(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      const isFullfilled = memberNick !== "" && memberPassword !== "";
      if (!isFullfilled) {
        throw new Error(Messages.error3);
      }

      const input: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const memberService = new MemberService();
      const result = await memberService.login(input);
      setAuthMember(result);
      dispatch(clearCache()); // Clear product cache when user logs in
      dispatch(clearLikesCache()); // Clear likes cache when user logs in
      handleLoginClose();
      setMemberNick("");
      setMemberPassword("");
      setShowPassword(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  return (
    <>
      {/* SIGNUP MODAL */}
      <Modal
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        sx={{ p: { xs: 1.5, sm: 2 } }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.90)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          },
        }}
      >
        <Fade in={signupOpen} timeout={400}>
          <GlassModal>
            <StyledCloseButton onClick={handleSignupClose} size="small">
              <CloseIcon />
            </StyledCloseButton>

            <Stack spacing={{ xs: 2.5, sm: 3.5 }}>
              <Box sx={{ textAlign: "center" }}>
                <IconWrapper>
                  <PersonIcon />
                </IconWrapper>
                <Typography
                  sx={{
                    fontSize: { xs: "26px", sm: "32px" },
                    fontWeight: 800,
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 0.5,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Create Account
                </Typography>
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "14px", sm: "15px" },
                    fontWeight: 500,
                  }}
                >
                  Start your delicious journey today
                </Typography>
              </Box>

              <GlassTextField
                fullWidth
                label="Username"
                variant="outlined"
                value={memberNick}
                onChange={handleUserName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <GlassTextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                value={memberPhone}
                onChange={handleUserPhone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <GlassTextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={memberPassword}
                onChange={handleUserPassword}
                onKeyDown={handlePasswordKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{
                          color: "#94a3b8",
                          "&:hover": { color: "#6366f1" },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <GradientButton fullWidth onClick={handleSignupRequest}>
                Create Account
              </GradientButton>
            </Stack>
          </GlassModal>
        </Fade>
      </Modal>

      {/* LOGIN MODAL */}
      <Modal
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        sx={{ p: { xs: 1.5, sm: 2 } }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.90)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          },
        }}
      >
        <Fade in={loginOpen} timeout={400}>
          <GlassModal>
            <StyledCloseButton onClick={handleLoginClose} size="small">
              <CloseIcon />
            </StyledCloseButton>

            <Stack spacing={{ xs: 2.5, sm: 3.5 }}>
              <Box sx={{ textAlign: "center" }}>
                <IconWrapper>
                  <LockIcon />
                </IconWrapper>
                <Typography
                  sx={{
                    fontSize: { xs: "26px", sm: "32px" },
                    fontWeight: 800,
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 0.5,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "14px", sm: "15px" },
                    fontWeight: 500,
                  }}
                >
                  Continue your culinary experience
                </Typography>
              </Box>

              <GlassTextField
                fullWidth
                label="Username"
                variant="outlined"
                value={memberNick}
                onChange={handleUserName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <GlassTextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={memberPassword}
                onChange={handleUserPassword}
                onKeyDown={handlePasswordKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{
                          color: "#94a3b8",
                          "&:hover": { color: "#6366f1" },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <GradientButton fullWidth onClick={handleLoginRequest}>
                Login to Account
              </GradientButton>
            </Stack>
          </GlassModal>
        </Fade>
      </Modal>
    </>
  );
}
