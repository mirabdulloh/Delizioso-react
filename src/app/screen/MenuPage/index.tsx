import { Routes, Route } from "react-router-dom";
import ChoosenProduct from "./ChoosenProduct";
import Menu from "./Menu";
import Promotions from "./Promotions";

function MenuPage() {
  return (
    <Routes>
      <Route
        path=":productId"
        element={<ChoosenProduct />}
      />

      <Route
        path=""
        element={
          <>
            <Menu />
            <Promotions />
          </>
        }
      />
    </Routes>
  );
}

export default MenuPage;
