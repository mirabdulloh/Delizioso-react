import React, { Suspense, lazy, useEffect, useLayoutEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import HomeNavbar from "./components/header/HomeNavbar";
import Footer from "./components/footer/Footer";

import OtherNavbar from "./components/header/OtherNavbar";
import { SocketProvider } from "./context/SocketContext";
import { useGlobals } from "./hooks/useGlobals";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import MemberService from "./services/MemberService";
import useBusket from "./hooks/useBusket";
import { clearCache } from "./screen/MenuPage/slice";
import { clearLikesCache } from "./screen/MenuPage/likesSlice";

const HomePage = lazy(() => import("./screen/HomePage"));
const MenuPage = lazy(() => import("./screen/MenuPage"));
const PromotionsAll = lazy(() => import("./screen/MenuPage/PromotionsAll"));
const OrderOnline = lazy(() => import("./screen/OrderOnline"));
const AboutUs = lazy(() => import("./screen/AboutUs"));
const CS = lazy(() => import("./screen/CS"));
const Contact = lazy(() => import("./screen/ContactUs/Contact"));
const Reservation = lazy(() => import("./screen/Reservation"));
const UserPage = lazy(() => import("./screen/MyPage"));
const AuthenticationModal = lazy(() => import("./components/auth"));

const routeLoadingStyle: React.CSSProperties = {
  minHeight: "40vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#5f5f5f",
  fontWeight: 800,
};

function App() {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBusket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { setAuthMember } = useGlobals();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
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
      dispatch(clearCache()); // Clear products cache on logout
      dispatch(clearLikesCache()); // Clear likes cache on logout
      navigate("/");
    } catch (err) {
      console.log(err);

      sweetErrorHandling(Messages.error1).then();
    }
  };
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !("scrollRestoration" in window.history)) {
      return;
    }

    const previousValue = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousValue;
    };
  }, []);

  useLayoutEffect(() => {
    if (location.hash || typeof window === "undefined") return;

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const rafId = window.requestAnimationFrame(resetScroll);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [location.key, location.hash]);

  return (
    <SocketProvider>
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

      <Suspense fallback={<div style={routeLoadingStyle}>Loading page...</div>}>
        <Routes>
          <Route path="/products/*" element={<MenuPage onAdd={onAdd} onRemove={onRemove} onDelete={onDelete} />} />
          <Route path="/promotions" element={<PromotionsAll />} />
          <Route path="/support" element={<CS />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/order-online" element={<OrderOnline cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete} />} />
          <Route path="/my-page" element={<UserPage />} />
          <Route path="/help" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/" element={<HomePage onLoginClick={() => setLoginOpen(true)} onAdd={onAdd} />} />
        </Routes>
      </Suspense>

      <Footer />
      {(signupOpen || loginOpen) && (
        <Suspense fallback={null}>
          <AuthenticationModal
            signupOpen={signupOpen}
            loginOpen={loginOpen}
            handleSignupClose={handleSignupClose}
            handleLoginClose={handleLoginClose}
          />
        </Suspense>
      )}
    </SocketProvider>
  );
}

export default App;
