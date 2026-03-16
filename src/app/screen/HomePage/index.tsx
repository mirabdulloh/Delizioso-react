import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import BestChefs from "./BestChefs";
import CostumerReviews from "./CostumerReviews";
import OpenCloseTime from "./OpenCloseTime";
import PopularMenu from "./PopularMenu";
import ReserveTable from "./ReserveTable";
import WelcomePage from "./WelcomePage";
import { setPopularDishes, setPaginationInfo } from "./slice";
import ProductService from "../../services/ProductService";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";

interface HomePageProps {
  onLoginClick?: () => void;
  onAdd: (item: CartItem) => void;
}

/** REDUX SLICE */
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
  setPaginationInfo: (data: { totalPages: number; totalCount: number }) =>
    dispatch(setPaginationInfo(data)),
});

function HomePage({ onLoginClick, onAdd = () => {} }: HomePageProps) {
  const { setPopularDishes, setPaginationInfo } = actionDispatch(useDispatch());
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    // Fetch popular dishes ordered by views.
    // The homepage only shows dishes with at least 2 views, so pagination
    // must be calculated from that same visible list.
    const productService = new ProductService();
    productService
      .getProducts({
        order: "productViews",
        page: page,
        limit: ITEMS_PER_PAGE,
      })
      .then((data) => {
        const visibleDishes = data.filter((dish) => dish.productViews >= 2);
        const visibleCount = visibleDishes.length;

        // If a stale page lands on an empty result, step back to the last valid page.
        if (page > 1 && visibleCount === 0) {
          setPaginationInfo({
            totalPages: page - 1,
            totalCount: (page - 1) * ITEMS_PER_PAGE,
          });
          setPage(page - 1);
          return;
        }

        setPopularDishes(visibleDishes);

        const totalCount = (page - 1) * ITEMS_PER_PAGE + visibleCount;
        const totalPages =
          visibleCount < ITEMS_PER_PAGE ? page : page + 1;

        setPaginationInfo({ totalPages, totalCount });
      })
      .catch((err) => {
        console.error("[HomePage] Error fetching popular dishes:", err);

        if (page > 1) {
          setPaginationInfo({
            totalPages: page - 1,
            totalCount: (page - 1) * ITEMS_PER_PAGE,
          });
          setPage(page - 1);
          return;
        }

        setPopularDishes([]);
        setPaginationInfo({ totalPages: 1, totalCount: 0 });
      });
  }, [page, setPopularDishes, setPaginationInfo]);

  return (
    <>
      <WelcomePage />
      <PopularMenu page={page} setPage={setPage} onAdd={onAdd} />
      <ReserveTable onLoginClick={onLoginClick} />
      <BestChefs />
      <CostumerReviews />
      <OpenCloseTime onLoginClick={onLoginClick} />
    </>
  );
}

export default HomePage;
