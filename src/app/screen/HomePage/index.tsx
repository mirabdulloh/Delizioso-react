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

/** REDUX SLICE */
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
  setPaginationInfo: (data: { totalPages: number; totalCount: number }) =>
    dispatch(setPaginationInfo(data)),
});

function HomePage() {
  const { setPopularDishes, setPaginationInfo } = actionDispatch(useDispatch());
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    // Fetch popular dishes by likes
    console.log("[HomePage] useEffect: Fetching popular dishes for page:", page);
    const productService = new ProductService();
    productService
      .getProducts({
        order: "productLikes",
        page: page,
        limit: ITEMS_PER_PAGE,
      })
      .then((data) => {
        console.log("[HomePage] Fetched data:", data);
        setPopularDishes(data);
        
        // If backend returns full response object with totalCount
        if (data && typeof data === "object" && "totalCount" in data && "data" in data) {
          const totalCount = (data as any).totalCount;
          const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
          console.log("[HomePage] Calculated totalPages:", totalPages);
          setPaginationInfo({ totalPages, totalCount });
        } else if (Array.isArray(data)) {
          // If data is just an array, calculate based on array length
          const itemCount = data.length;
          console.log("[HomePage] Got", itemCount, "items on page", page);
          // If we got less than ITEMS_PER_PAGE items, we're on the last page
          if (itemCount < ITEMS_PER_PAGE) {
            setPaginationInfo({ totalPages: page, totalCount: itemCount * page });
          } else {
            // Assume there might be more pages
            setPaginationInfo({ totalPages: page + 1, totalCount: itemCount * (page + 1) });
          }
        }
      })
      .catch((err) => console.error("[HomePage] Error fetching popular dishes:", err));
  }, [page, setPopularDishes, setPaginationInfo]);

  return (
    <>
      <WelcomePage />
      <PopularMenu page={page} setPage={setPage} />
      <ReserveTable />
      <BestChefs />
      <CostumerReviews />
      <OpenCloseTime />
    </>
  );
}

export default HomePage;
