import { Box, Container, Card, CardContent } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import "../../../css/userPage.css";
import "../../../css/profile.css";
import { useNavigate } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi, Messages } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import { MemberUpdateInput } from "../../../lib/types/member";
import { useState } from "react";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import MemberService from "../../services/MemberService";
import FinishedOrders from "./FinishedOrders";

function Settings() {
  const { authMember, setAuthMember } = useGlobals();
  const member = authMember;

  const [memberImage, setMemberImage] = useState<string>(
    member?.memberImage
      ? `${serverApi}/${member.memberImage}`
      : "/icons/default-user.svg",
  );

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
      // Removed required fields check so user can update any field independently
      const memberService = new MemberService();
      const result = await memberService.updateMember(memberUpdateInput);
      setAuthMember(result);
      await sweetTopSmallSuccessAlert("modified successfully", 700);
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
    <Box className="settings">
      <Box className="member-media-frame">
        <img src={memberImage} className="mb-image" alt="Member" />

        <div className="media-change-box">
          <span className="upload-title">Upload image</span>
          <p className="upload-desc">JPG, JPEG, PNG formats only!</p>

          <div className="up-del-box">
            <Button component="label">
              <CloudDownloadIcon />
              <input type="file" hidden onChange={handleImageViewer} />
            </Button>
          </div>
        </div>
      </Box>

      <Box className="input-frame">
        <div className="long-input">
          <label className="spec-label">Username</label>
          <input
            className="spec-input mb-nick"
            type="text"
            placeholder={member?.memberNick ?? "username"}
            value={memberUpdateInput.memberNick}
            name="memberNick"
            onChange={memberNickHandller}
          />
        </div>
      </Box>

      <Box className="input-frame">
        <div className="short-input">
          <label className="spec-label">Phone</label>
          <input
            className="spec-input mb-phone"
            type="text"
            placeholder={member?.memberPhone ?? "no phone"}
            value={memberUpdateInput.memberPhone}
            name="memberPhone"
            onChange={memberPhoneHandller}
          />
        </div>

        <div className="short-input">
          <label className="spec-label">Email</label>
          <input
            className="spec-input mb-email"
            type="email"
            placeholder={member?.memberEmail ?? "no email"}
            value={memberUpdateInput.memberEmail || ""}
            name="memberEmail"
            onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, memberEmail: e.target.value })}
          />
        </div>
      </Box>

      <Box className="input-frame">
        <div className="long-input">
          <label className="spec-label">Address</label>
          <input
            className="spec-input mb-address"
            type="text"
            placeholder={member?.memberAddress ?? "no address"}
            value={memberUpdateInput.memberAddress}
            name="memberAddress"
            onChange={memberAdressHandller}
          />
        </div>
      </Box>

      <Box className="input-frame">
        <div className="long-input">
          <label className="spec-label">Description</label>
          <textarea
            className="spec-textarea mb-description"
            placeholder={member?.memberDesc ?? "no desc"}
            value={memberUpdateInput.memberDesc}
            name="memberDesc"
            onChange={memberDecsHandller}
          />
        </div>
      </Box>

      <Box className="save-box">
        <Button variant="contained" onClick={handleSubmitButton}>
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default function UserPage() {
  const navigate = useNavigate();
  const { authMember } = useGlobals();
  const member = authMember;

  if (!authMember) {
    navigate("/");
    return null;
  }

  return (
    <div className="user-page">
      <Container>
        {/* IMPORTANT: use Box (not Stack) so CSS grid works */}
        <Box className="my-page-frame">
          {/* LEFT */}
          <Box className="my-page-left">
            <Box display="flex" flexDirection="column">
              <Box className="menu-name">Edit Profile</Box>
              <Box className="menu-content">
                <Settings />
              </Box>
            </Box>
          </Box>

          {/* RIGHT */}
          <Box className="my-page-right">
            <Box className="order-info-box">
              <Box display="flex" flexDirection="column" alignItems="center">
                <div className="order-user-img">
                  <img
                    src={
                      member?.memberImage
                        ? `${serverApi}/${member.memberImage}`
                        : "/icons/default-user.svg"
                    }
                    className="order-user-avatar"
                    alt="User Avatar"
                  />
                  <div className="order-user-icon-box">
                    <img
                      src={
                        member?.memberType === MemberType.RESTAURANT
                          ? "/icons/restaurant.svg"
                          : "/icons/user-badge.svg"
                      }
                      alt="Member Type"
                    />
                  </div>
                </div>

                <span className="order-user-name">{member?.memberNick}</span>
                <span className="order-user-prof">{member?.memberType}</span>
                <span className="order-user-prof">
                  {member?.memberAddress ? member.memberAddress : "No Address"}
                </span>
              </Box>

              <Box className="user-media-box">
                <FacebookIcon />
                <InstagramIcon />
                <TelegramIcon />
                <YouTubeIcon />
              </Box>

              <p className="user-desc">
                {member?.memberDesc ? member.memberDesc : "No description"}
              </p>

              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ fontSize: 12, color: "#666", mb: 1 }}>
                    Loyalty Points
                  </Box>
                  <Box sx={{ fontSize: 28, fontWeight: 800 }}>
                    {member?.memberPoints || 0}
                  </Box>
                  <Box sx={{ fontSize: 12, color: "#999", mt: 0.5 }}>pts</Box>
                </CardContent>
              </Card>

              <Box sx={{ mt: 2 }}>
                <Box sx={{ fontWeight: 800, fontSize: 14, mb: 2 }}>
                  Recent Orders
                </Box>
                <FinishedOrders />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
