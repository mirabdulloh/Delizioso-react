import { Routes, Route } from "react-router-dom";
import ChoosenProduct from "./ChoosenProduct";
import Menu from "./Menu";
import Promotions from "./Promotions";
import { MenuPageProps } from "../../../lib/types/screen";

function MenuPage({ onAdd, onRemove, onDelete }: MenuPageProps) {
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
