import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Container,
  Button,
  Rating,
  TextField,
  InputAdornment,
  Pagination,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import ProductService from "../../services/ProductService";
import { setPromotions, setPromotionsLoading } from "./slice";
import { RootState } from "../../store";
import useBusket from "../../hooks/useBusket";
import { resolveMediaUrl } from "../../../lib/config";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import { scrollToSectionTop } from "../../../lib/scroll";

import "../../../css/menu.css";
import OrderList from "./OrderList";

const productService = new ProductService();

function PromotionsAll() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { onAdd } = useBusket();
  const { authMember } = useGlobals();

  const promotions = useSelector(
    (state: RootState) => state.menuPage.promotions,
  );
  const loading = useSelector(
    (state: RootState) => state.menuPage.promotionsLoading,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = isMobile ? 4 : 6;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        dispatch(setPromotionsLoading(true));
        const data = await productService.getPromotions(
          currentPage,
          itemsPerPage,
        );
        dispatch(setPromotions(data));
        // Calculate total pages (you may need to get this from backend)
        if (data.length === itemsPerPage) {
          setTotalPages(currentPage + 1); // Estimate, better to get from backend
        }
      } catch (error) {
        console.error("Failed to fetch promotions", error);
        dispatch(setPromotionsLoading(false));
      }
    };

    fetchPromotions();
  }, [dispatch, currentPage, itemsPerPage]);

  const handleOrder = (product: any) => {
    if (!authMember) {
      sweetErrorHandling({ message: "Please sign up first" });
      return;
    }
    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice * (1 - (product.productPromotion || 0) / 100),
      image: product.productImages[0],
    });
    sweetTopSmallSuccessAlert(product.productName);
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price.toFixed(2);
    return (price * (1 - discount / 100)).toFixed(2);
  };

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
    scrollToSectionTop(sectionRef.current);
  };

  const filteredPromotions = promotions.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ✅ HARD CODE: false = 4 cards, true = 3 cards + order list
  const cartOpen = false;

  if (loading) {
    return (
      <div ref={sectionRef} className="promoAll-section">
        <Container>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Box sx={{ fontSize: "1.2rem", color: "#666" }}>
              Loading promotions...
            </Box>
          </Box>
        </Container>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div ref={sectionRef} className="promoAll-section">
        <Container>
          <Box className="promoAll-title">Hot Promotions</Box>
          <Box className="promoAll-subtitle">
            Discounts 30%+ • Limited time deals
          </Box>
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              mt: 4,
            }}
          >
            <Box
              sx={{ fontSize: "1.8rem", fontWeight: 600, color: "#333", mb: 2 }}
            >
              No Promotions Available
            </Box>
            <Box sx={{ fontSize: "1.1rem", color: "#666" }}>
              Check back later for exciting deals!
            </Box>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="promoAll-section">
      <Container>
        {/* title */}
        <Box className="promoAll-title">Hot Promotions</Box>
        <Box className="promoAll-subtitle">
          Discounts 30%+ • Limited time deals
        </Box>

        {/* search */}
        <Box className="promoAll-topbar">
          <TextField
            className="promoAll-search"
            placeholder="Search promotions..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* layout */}
        <Box
          className={`promoAll-layout ${cartOpen ? "with-cart" : "no-cart"}`}
        >
          {/* LEFT */}
          <Box className="promoAll-left">
            <Box className={`promoAll-grid ${cartOpen ? "cols-3" : "cols-4"}`}>
              {filteredPromotions.map((item) => (
                <Box key={item._id} className="promoAll-card" role="button">
                  {/* % off + tag */}
                  <Box className="promoAll-badges">
                    <Box className="promoAll-off">
                      -{item.productPromotion}%
                    </Box>
                  </Box>

                  {/* image */}
                  <Box className="promoAll-imgWrap">
                    <Box
                      component="img"
                      src={resolveMediaUrl(item.productImages[0])}
                      alt={item.productName}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </Box>

                  {/* name */}
                  <Box className="promoAll-name">{item.productName}</Box>

                  {/* rating */}
                  <Box className="promoAll-rating">
                    <Rating
                      name={`rating-${item._id}`}
                      value={Number(item.productRank) || 0}
                      readOnly
                      size="medium"
                    />
                    <Box
                      sx={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#666",
                        backgroundColor: "#f5f5f5",
                        px: 1,
                        py: 0.25,
                        borderRadius: "8px",
                      }}
                    >
                      ({item.productReviewCount || 0} reviews)
                    </Box>
                  </Box>

                  {/* desc */}
                  <Box className="promoAll-desc">
                    {item.productDesc || "Limited time deal"}
                  </Box>

                  {/* prices + button */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="promoAll-foot"
                  >
                    <Box className="promoAll-price">
                      <span className="promoAll-old">
                        ${item.productPrice.toFixed(2)}
                      </span>
                      <span className="promoAll-new">
                        $
                        {calculateDiscountedPrice(
                          item.productPrice,
                          item.productPromotion,
                        )}
                      </span>
                    </Box>

                    <Button
                      variant="contained"
                      color="secondary"
                      className="promoAll-order"
                      onClick={() => handleOrder(item)}
                    >
                      Order
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            {!searchTerm && totalPages > 1 && (
              <Box
                className="promoAll-paginationWrap"
                sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}
              >
                <Pagination
                  className="promoAll-pagination"
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="secondary"
                  size={isMobile ? "medium" : "large"}
                  siblingCount={isMobile ? 0 : 1}
                  boundaryCount={isMobile ? 1 : 2}
                />
              </Box>
            )}
          </Box>

          {/* RIGHT */}
          {cartOpen ? <OrderList /> : null}
        </Box>
      </Container>
    </div>
  );
}

export default PromotionsAll;
