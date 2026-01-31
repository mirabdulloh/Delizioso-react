import React, { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import HomeNavbar from "./components/header/HomeNavbar";
import Footer from "./components/footer/Footer";

import HomePage from "./screen/HomePage";
import MenuPage from "./screen/MenuPage";
import PromotionsAll from "./screen/MenuPage/PromotionsAll";
import OtherNavbar from "./components/header/OtherNavbar";
import OrderOnline from "./screen/OrderOnline";
import AboutUs from "./screen/AboutUs";
import CS from "./screen/CS";
import Contact from "./screen/ContactUs/Contact";
import Reservation from "./screen/Reservation";
import UserPage from "./screen/MyPage";
import AuthenticationModal from "./components/auth";
import { useGlobals } from "./hooks/useGlobals";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import MemberService from "./services/MemberService";
import useBusket from "./hooks/useBusket";

function App() {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBusket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { setAuthMember } = useGlobals();
  const navigate = useNavigate();
  
  /** HANDLERS **/
  const handleSignupClose = () => {
    setSignupOpen(false);
  };
  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleLogoutClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseLogout = () => {
    setAnchorEl(null);
  };
  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout();
      await sweetTopSuccessAlert("success", 700);
      setAuthMember(null);
      navigate("/");
    } catch (err) {
      console.log(err);

      sweetErrorHandling(Messages.error1).then();
    }
  };
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" ? (
        <HomeNavbar 
          onLoginClick={() => setLoginOpen(true)}
          onSignupClick={() => setSignupOpen(true)}
          anchorEl={anchorEl}
          onAvatarClick={handleLogoutClick}
          onLogoutMenuClose={handleCloseLogout}
          onLogoutRequest={handleLogoutRequest}
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelete={onDelete}
          onDeleteAll={onDeleteAll}
        />
      ) : (
        <OtherNavbar 
          onLoginClick={() => setLoginOpen(true)}
          onSignupClick={() => setSignupOpen(true)}
          anchorEl={anchorEl}
          onAvatarClick={handleLogoutClick}
          onLogoutMenuClose={handleCloseLogout}
          onLogoutRequest={handleLogoutRequest}
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelete={onDelete}
          onDeleteAll={onDeleteAll}
        />
      )}

      <Routes>
        <Route path="/products/*" element={<MenuPage />} />
        <Route path="/promotions" element={<PromotionsAll />} />
        <Route path="/support" element={<CS />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/order-online" element={<OrderOnline cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete} />} />
        <Route path="/my-page" element={<UserPage />} />
        <Route path="/help" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/" element={<HomePage onLoginClick={() => setLoginOpen(true)} onAdd={onAdd} />} />
      </Routes>

      <Footer />
      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleSignupClose={handleSignupClose}
        handleLoginClose={handleLoginClose}
      />
    </>
  );
}

export default App;
