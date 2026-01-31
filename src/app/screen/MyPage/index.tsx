import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import "../../../css/userPage.css";
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
    member?.memberImg
      ? `${serverApi}/${member.memberImg}`
      : "/icons/default-user.svg"
  );

  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(
    {
      memberNick: member?.memberNick,
      memberPhone: member?.memberPhone,
      memberAddress: member?.memberAddress,
      memberDesc: member?.memberDesc,
      memberImg: member?.memberImg,
    }
  );

  const memberNickHandller = (e: any) => {
    memberUpdateInput.memberNick = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberPhoneHandller = (e: any) => {
    memberUpdateInput.memberPhone = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberDecsHandller = (e: any) => {
    memberUpdateInput.memberDesc = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const memberAdressHandller = (e: any) => {
    memberUpdateInput.memberAddress = e.target.value;
    setMemberUpdateInput({ ...memberUpdateInput });
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (
        memberUpdateInput.memberNick === "" ||
        memberUpdateInput.memberPhone === "" ||
        memberUpdateInput.memberAddress === "" ||
        memberUpdateInput.memberDesc === ""
      ) {
        throw new Error(Messages.error3);
      }
      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);

      await sweetTopSmallSuccessAlert("modified successfully", 700);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleImageViewer = (e: any) => {
    const file = e.target.files[0];
    console.log("file", file);
    const fileType = file.type;
    const validateImagetypes = ["image/jpg", "image/png", "image/jpeg"];
    if (!validateImagetypes.includes(fileType)) {
      sweetErrorHandling(Messages.error5);
    } else {
      memberUpdateInput.memberImg = file;
      setMemberUpdateInput({ ...memberUpdateInput });
      setMemberImage(URL.createObjectURL(file));
    }
  };

  return (
    <Box className={"settings"}>
      <Box className={"member-media-frame"}>
        <img src={memberImage} className={"mb-image"} alt="Member" />
        <div className={"media-change-box"}>
          <span style={{ marginLeft: "10px" }}>Upload image</span>
          <p style={{ marginLeft: "10px" }}>JPG, JPEG, PNG formats only!</p>
          <div className={"up-del-box"} style={{ marginLeft: "10px" }}>
            <Button component="label">
              <CloudDownloadIcon />
              <input type="file" hidden onChange={handleImageViewer} />
            </Button>
          </div>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Username</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={member?.memberNick}
            value={memberUpdateInput.memberNick}
            name="memberNick"
            onChange={memberNickHandller}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Phone</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={member?.memberPhone ?? "no phone"}
            value={memberUpdateInput.memberPhone}
            name="memberPhone"
            onChange={memberPhoneHandller}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Address</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder={
              member?.memberAddress ? member.memberAddress : "no address"
            }
            value={memberUpdateInput.memberAddress}
            name="memberAddress"
            onChange={memberAdressHandller}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Description</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={member?.memberDesc ? member.memberDesc : "no desc"}
            value={memberUpdateInput.memberDesc}
            name="memberDesc"
            onChange={memberDecsHandller}
          />
        </div>
      </Box>
      <Box className={"save-box"}>
        <Button variant={"contained"} onClick={handleSubmitButton}>
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

  console.log("=== MyPage authMember ===", authMember);
  console.log("=== MyPage member ===", member);

  if (!authMember) {
    navigate("/");
    return null;
  }

  return (
    <div className={"user-page"}>
      <Container>
        <Stack className={"my-page-frame"}>
          <Stack className={"my-page-left"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Box className={"menu-name"}>Modify Member Details</Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>
          </Stack>

          <Stack className={"my-page-right"}>
            <Box className={"order-info-box"}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <div className={"order-user-img"}>
                  <img
                    src={
                      member?.memberImg
                        ? `${serverApi}/${member.memberImg}`
                        : "/icons/default-user.svg"
                    }
                    className={"order-user-avatar"}
                    alt="User Avatar"
                  />
                  <div className={"order-user-icon-box"}>
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
                <span className={"order-user-name"}>
                  {member?.memberNick}
                </span>
                <span className={"order-user-prof"}>
                  {member?.memberType}
                </span>
                <span className={"order-user-prof"}>
                  {member?.memberAddress
                    ? member.memberAddress
                    : "No Address"}
                </span>
              </Box>
              <Box className={"user-media-box"}>
                <FacebookIcon />
                <InstagramIcon />
                <TelegramIcon />
                <YouTubeIcon />
              </Box>
              <p className={"user-desc"}>
                {member?.memberDesc
                  ? member.memberDesc
                  : "No description"}
              </p>
              
              {/* Finished Orders Section */}
              <Box sx={{ mt: 3 }}>
                <FinishedOrders />
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
