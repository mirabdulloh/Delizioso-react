import React from "react";
import Navbar from "./components/header/Navbar";
import HomePage from "./screen/HomePage";
import MenuPage from "./screen/MenuPage";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <>
      <Navbar />
      <HomePage />
      <MenuPage />
      <Footer />
    </>
  );
}

export default App;
