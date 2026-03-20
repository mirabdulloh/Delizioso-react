import { Box, Container, Card, CardContent, Tabs, Tab, Avatar, Chip, IconButton, Stack, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import Button from "@mui/material/Button";
import "../../../css/userPage.css";
import "../../../css/profile.css";
import { useNavigate } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { resolveMediaUrl, serverApi, Messages } from "../../../lib/config";
import { MemberUpdateInput } from "../../../lib/types/member";
import { useState, useEffect } from "react";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import MemberService from "../../services/MemberService";
import FinishedOrders from "./FinishedOrders";
import MyReviews from "./MyReviews";

function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const member = authMember;

  const [memberImage, setMemberImage] = useState<string>(
    member?.memberImage
      ? resolveMediaUrl(member.memberImage)
      : "/icons/default-user.svg",
  );

  // Sync memberImage with authMember changes
  useEffect(() => {
    if (member?.memberImage) {
      setMemberImage(resolveMediaUrl(member.memberImage));
    }
  }, [member?.memberImage]);

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: member?.memberNick,
      memberPhone: member?.memberPhone,
      memberAddress: member?.memberAddress,
      memberDesc: member?.memberDesc,
      memberImage: member?.memberImage,
      memberEmail: member?.memberEmail,
    },
  );

  // Sync form inputs with authMember changes
  useEffect(() => {
    if (member) {
      setMemberUpdateInput({
        memberNick: member.memberNick,
        memberPhone: member.memberPhone,
        memberAddress: member.memberAddress,
        memberDesc: member.memberDesc,
        memberImage: member.memberImage,
        memberEmail: member.memberEmail,
      });
    }
  }, [member]);

  const memberNickHandller = (e: any) => {
    setMemberUpdateInput({ ...memberUpdateInput, memberNick: e.target.value });
  };

  const memberPhoneHandller = (e: any) => {
    setMemberUpdateInput({ ...memberUpdateInput, memberPhone: e.target.value });
  };

  const memberDecsHandller = (e: any) => {
    setMemberUpdateInput({ ...memberUpdateInput, memberDesc: e.target.value });
  };

  const memberAdressHandller = (e: any) => {
    setMemberUpdateInput({
      ...memberUpdateInput,
      memberAddress: e.target.value,
    });
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const memberService = new MemberService();
      const result = await memberService.updateMember(memberUpdateInput);
      setAuthMember(result);
      await sweetTopSmallSuccessAlert("Profile updated successfully!", 700);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleImageViewer = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    const validateImagetypes = ["image/jpg", "image/png", "image/jpeg"];

    if (!validateImagetypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5);
      return;
    }

    setMemberUpdateInput({ ...memberUpdateInput, memberImage: file });
    setMemberImage(URL.createObjectURL(file));
  };

  return (
    <Box>
      {/* Profile Picture Section */}
      <Card className="profile-picture-card">
        <Typography variant="h6" className="profile-section-title">
          Profile Picture
        </Typography>
        <Box className="profile-picture-content">
          <Avatar 
            key={memberImage}
            src={memberImage}
            className="profile-picture-avatar"
          />
          <Box className="profile-picture-text">
            <Typography variant="body2" className="profile-picture-subtitle">
              Upload a new profile picture
            </Typography>
            <Typography variant="caption" className="profile-picture-caption">
              JPG, JPEG, PNG formats only. Max size 5MB
            </Typography>
            <Button 
              component="label"
              variant="contained"
              startIcon={<CloudDownloadIcon />}
              className="profile-picture-btn"
            >
              Choose Image
              <input type="file" hidden onChange={handleImageViewer} />
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Personal Information */}
      <Card className="personal-info-card">
        <Typography variant="h6" className="personal-info-title">
          Personal Information
        </Typography>
        
        <div className="personal-info-grid">
          <div className="form-field">
            <Typography variant="body2" className="field-label">
              Username
            </Typography>
            <input
              className="modern-input"
              type="text"
              placeholder="Enter your username"
              value={memberUpdateInput.memberNick}
              onChange={memberNickHandller}
            />
          </div>

          <div className="form-field">
            <Typography variant="body2" className="field-label">
              Email Address
            </Typography>
            <input
              className="modern-input"
              type="email"
              placeholder="Enter your email"
              value={memberUpdateInput.memberEmail || ""}
              onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, memberEmail: e.target.value })}
            />
          </div>

          <div className="form-field">
            <Typography variant="body2" className="field-label">
              Phone Number
            </Typography>
            <input
              className="modern-input"
              type="text"
              placeholder="Enter your phone"
              value={memberUpdateInput.memberPhone}
              onChange={memberPhoneHandller}
            />
          </div>

          <div className="form-field">
            <Typography variant="body2" className="field-label">
              Address
            </Typography>
            <input
              className="modern-input"
              type="text"
              placeholder="Enter your address"
              value={memberUpdateInput.memberAddress}
              onChange={memberAdressHandller}
            />
          </div>

          <div className="form-field form-field-full">
            <Typography variant="body2" className="field-label">
              About Me
            </Typography>
            <textarea
              className="modern-textarea"
              placeholder="Tell us about yourself..."
              value={memberUpdateInput.memberDesc}
              onChange={memberDecsHandller}
              rows={4}
            />
          </div>
        </div>
      </Card>

      {/* Payment Card (Design Only) */}
      <Card className="payment-card-design">
        <Typography variant="h6" className="payment-card-title">
          Payment Card
        </Typography>
        <div className="payment-card-grid">
          <div className="form-field">
            <Typography variant="body2" className="field-label">
              Cardholder Name
            </Typography>
            <input
              className="modern-input"
              type="text"
              placeholder="MAX"
              defaultValue="MAX"
              
            />
          </div>

          <div className="form-field">
            <Typography variant="body2" className="field-label">
              Card Number
            </Typography>
            <input
              className="modern-input"
              type="text"
              placeholder="**** **** **** 1234"
              defaultValue="**** **** **** 1234"
              
            />
          </div>

          <div className="form-field">
            <Typography variant="body2" className="field-label">
              Expiry Date
            </Typography>
            <input
              className="modern-input"
              type="text"
              placeholder="08/28"
              defaultValue="08/28"
              
            />
          </div>

          <div className="form-field">
            <Typography variant="body2" className="field-label">
              CVV
            </Typography>
            <input
              className="modern-input"
              type="password"
              placeholder="***"
              defaultValue="***"
              
            />
          </div>
        </div>

        <div className="payment-card-visual">
          <div className="payment-card-icons">
            <div className="payment-icon visa">VISA</div>
            <div className="payment-icon mastercard">MC</div>
            <div className="payment-icon amex">AMEX</div>
            <div className="payment-icon applepay"></div>
          </div>
          <div className="payment-card-caption">
            Secure payments • Cards supported
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <Box className="action-buttons">
        <Button 
          variant="outlined" 
          size="large"
          className="cancel-btn"
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleSubmitButton}
          className="save-btn"
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}

export default function UserPage() {
  const navigate = useNavigate();
  const { authMember } = useGlobals();
  const member = authMember;
  const [currentTab, setCurrentTab] = useState(0);

  if (!authMember) {
    navigate("/");
    return null;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <div className="user-page">
      <Container>
        {/* Profile Header Card */}
        <Card className="profile-header-card">
          {/* Cover Image */}
          <Box className="profile-cover">
            {/* <IconButton className="edit-cover-btn">
              <EditIcon sx={{ color: "white" }} />
            </IconButton> */}
          </Box>

          <CardContent sx={{ pt: 0 }}>
            <div className="profile-header-content">
              {/* Profile Info Section */}
              <div className="profile-info-section">
                <Box className="profile-avatar-section">
                  {/* Avatar */}
                  <Avatar
                    key={authMember?.memberImage || 'default'}
                    src={
                      authMember?.memberImage
                        ? `${resolveMediaUrl(authMember.memberImage)}?t=${Date.now()}`
                        : "/icons/default-user.svg"
                    }
                    className="profile-header-avatar"
                  />

                  {/* User Details */}
                  <Box className="profile-user-details">
                    <Box className="profile-name-row">
                      <Typography variant="h4" className="profile-name">
                        {member?.memberNick}
                      </Typography>
                      <Chip 
                        label={member?.memberType}
                        color="secondary"
                        size="small"
                        className="member-type-chip"
                      />
                    </Box>

                    <Stack spacing={1} className="contact-info-stack">
                      {member?.memberEmail && (
                        <Box className="contact-info-item">
                          <EmailIcon fontSize="small" />
                          <Typography variant="body2">{member.memberEmail}</Typography>
                        </Box>
                      )}
                      {member?.memberPhone && (
                        <Box className="contact-info-item">
                          <PhoneIcon fontSize="small" />
                          <Typography variant="body2">{member.memberPhone}</Typography>
                        </Box>
                      )}
                      {member?.memberAddress && (
                        <Box className="contact-info-item">
                          <LocationOnIcon fontSize="small" />
                          <Typography variant="body2">{member.memberAddress}</Typography>
                        </Box>
                      )}
                    </Stack>

                    <Typography variant="body2" className={`profile-description ${!member?.memberDesc ? 'empty' : ''}`}>
                      {member?.memberDesc || "No description yet. Share something about yourself!"}
                    </Typography>

                    {/* Social Media */}
                    <Box className="social-media-icons">
                      <IconButton size="small" className="social-icon facebook-icon">
                        <FacebookIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" className="social-icon instagram-icon">
                        <InstagramIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" className="social-icon telegram-icon">
                        <TelegramIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" className="social-icon youtube-icon">
                        <YouTubeIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </div>

              {/* Stats Section */}
              <div className="profile-stats-section">
                <Box className="stats-wrapper">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <Card className="stat-card points-card">
                        <StarIcon className="stat-icon points-icon" />
                        <Typography variant="h5" className="stat-value">
                          {member?.memberPoints || 0}
                        </Typography>
                        <Typography variant="caption" className="stat-label points-label">
                          Loyalty Points
                        </Typography>
                      </Card>
                    </div>
                    <div className="stat-item">
                      <Card className="stat-card orders-card">
                        <ReceiptLongIcon className="stat-icon orders-icon" />
                        <Typography variant="h5" className="stat-value">
                          {member?.totalOrders || 0}
                        </Typography>
                        <Typography variant="caption" className="stat-label orders-label">
                          Total Orders
                        </Typography>
                      </Card>
                    </div>
                  </div>
                </Box>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card className="tabs-card">
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            className="profile-tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="My page sections"
          >
            <Tab label="Edit Profile" />
            <Tab label="Order History" />
            <Tab label="My Reviews" icon={<RateReviewRoundedIcon />} iconPosition="start" />
          </Tabs>
        </Card>

        {/* Content Area */}
        {currentTab === 0 && (
          <Card className="content-card">
            <Settings />
          </Card>
        )}

        {currentTab === 1 && (
          <Card className="content-card">
            <Typography variant="h6" className="content-title">
              Order History
            </Typography>
            <FinishedOrders />
          </Card>
        )}

        {currentTab === 2 && (
          <Card className="content-card">
            <MyReviews />
          </Card>
        )}
      </Container>
    </div>
  );
}
