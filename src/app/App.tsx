import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import HomeNavbar from "./components/header/HomeNavbar";
import Footer from "./components/footer/Footer";

import HomePage from "./screen/HomePage";
import MenuPage from "./screen/MenuPage";
import PromotionsAll from "./screen/MenuPage/PromotionsAll";
import OtherNavbar from "./components/header/OtherNavbar";

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" ? <HomeNavbar /> : <OtherNavbar />}

      <Routes>
        <Route path="/products/*" element={<MenuPage />} />
        <Route path="/promotions" element={<PromotionsAll />} />
        <Route path="/" element={<HomePage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
