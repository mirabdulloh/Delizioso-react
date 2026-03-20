import React, { useEffect } from "react";
import { Box, Stack, Button, Chip, Container } from "@mui/material";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";
import { setPromotions, setPromotionsLoading } from "./slice";
import { RootState } from "../../store";
import useBusket from "../../hooks/useBusket";
import { serverApi } from "../../../lib/config";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

import "../../../css/menu.css";

const productService = new ProductService();

function Promotions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { onAdd } = useBusket();
  const { authMember } = useGlobals();
  
  const promotions = useSelector((state: RootState) => state.menuPage.promotions);
  const loading = useSelector((state: RootState) => state.menuPage.promotionsLoading);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        dispatch(setPromotionsLoading(true));
        const data = await productService.getPromotions();
        dispatch(setPromotions(data));
      } catch (error) {
        console.error("Failed to fetch promotions", error);
        dispatch(setPromotionsLoading(false));
      }
    };

    fetchPromotions();
  }, [dispatch]);

  // Separate promotions by discount percentage
  const promo45 = promotions.find((p) => p.productPromotion === 45);
  const promo30 = promotions.filter((p) => p.productPromotion === 30);
  const otherPromos = promotions.filter(
    (p) => p.productPromotion !== 45 && p.productPromotion !== 30
  );

  const handleOrder = (product: any) => {
    if (!authMember) {
      sweetErrorHandling({ message: "Please sign up first" });
      return;
    }
    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice * (1 - product.productPromotion / 100),
      image: product.productImages[0],
    });
    sweetTopSmallSuccessAlert(product.productName);
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price.toFixed(2);
    return (price * (1 - discount / 100)).toFixed(2);
  };

  if (loading) {
    return (
      <div className="promotions">
        <Box className="promo2">
          <Container>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Box sx={{ fontSize: '1.2rem', color: '#666' }}>Loading promotions...</Box>
            </Box>
          </Container>
        </Box>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="promotions">
        <Box className="promo2">
          <Container>
            <Stack spacing={0.5} sx={{ mb: 4 }}>
              <Box className="promo2-title">Hot Promotions</Box>
              <Box className="promo2-sub">Discounts 30%+ • Limited time deals</Box>
            </Stack>
            <Box sx={{ 
              textAlign: 'center', 
              py: 8, 
              backgroundColor: '#f8f9fa', 
              borderRadius: 2 
            }}>
              <Box sx={{ fontSize: '1.5rem', fontWeight: 600, color: '#333', mb: 1 }}>
                No Promotions Available
              </Box>
              <Box sx={{ fontSize: '1rem', color: '#666' }}>
                Check back later for exciting deals!
              </Box>
            </Box>
          </Container>
        </Box>
      </div>
    );
  }

  return (
    <div className="promotions">
      <Box className="promo2">
        <Container>
          {/* header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="promo2-head"
          >
            <Stack spacing={0.5}>
              <Box className="promo2-title">Hot Promotions</Box>
              <Box className="promo2-sub">
                Discounts 30%+ • Limited time deals
              </Box>
            </Stack>

            <Button
              className="promo2-viewAll"
              variant="text"
              onClick={() => navigate("/promotions")}
            >
              View all
            </Button>
          </Stack>

          {/* big banner + side cards */}
          <Box className="promo2-grid">
            {/* BIG HERO */}
            {promo45 ? (
              <Box className="promo2-hero">
                <Box className="promo2-hero-bg" />

                <Box className="promo2-hero-overlay" />

                <Box className="promo2-hero-content">
                  <Stack direction="row" spacing={1} className="promo2-badges">
                    <Chip
                      icon={<LocalFireDepartmentRoundedIcon />}
                      label="Hot Deal"
                      className="promo2-chip promo2-chip-hot"
                    />
                    <Chip
                      icon={<AccessTimeRoundedIcon />}
                      label="Limited Time"
                      className="promo2-chip promo2-chip-time"
                    />
                  </Stack>

                  <Box className="promo2-hero-h1">Up to 45% OFF</Box>
                  <Box className="promo2-hero-h2">{promo45.productName}</Box>

                  <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                    <Box className="promo2-priceRow">
                      <Box className="promo2-old">${promo45.productPrice.toFixed(2)}</Box>
                      <Box className="promo2-new">
                        ${calculateDiscountedPrice(promo45.productPrice, promo45.productPromotion)}
                      </Box>
                    </Box>

                    <Box className="promo2-off">-{promo45.productPromotion}%</Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} mt={7}>
                    <Button
                      variant="contained"
                      color="secondary"
                      className="promo2-btn"
                      onClick={() => handleOrder(promo45)}
                    >
                      Order now
                    </Button>
                  </Stack>
                </Box>

                {/* hero image */}
                <Box
                  component="img"
                  src={`${serverApi}/${promo45.productImages[0]}`}
                  alt={promo45.productName}
                  className="promo2-hero-img"
                  decoding="async"
                />
              </Box>
            ) : (
              <Box className="promo2-hero">
                <Box className="promo2-hero-bg" />
                <Box className="promo2-hero-overlay" />
                <Box className="promo2-hero-content">
                  <Box className="promo2-hero-h1">No 45% promotions available</Box>
                </Box>
              </Box>
            )}

            {/* RIGHT SMALL CARDS */}
            <Stack spacing={2} className="promo2-side">
              {promo30.slice(0, 2).map((promo, index) => (
                <Box 
                  key={promo._id} 
                  className={`promo2-mini ${index === 1 ? 'promo2-mini-dark' : ''}`}
                >
                  <Box className="promo2-mini-top">
                    <Box className="promo2-mini-off">-{promo.productPromotion}%</Box>
                    <Box className="promo2-mini-tag">{promo.productCollection}</Box>
                  </Box>

                  <Box className="promo2-mini-name">{promo.productName}</Box>

                  <Stack direction="row" spacing={1} alignItems="baseline" mt={1}>
                    <Box className="promo2-mini-old">${promo.productPrice.toFixed(2)}</Box>
                    <Box className="promo2-mini-new">
                      ${calculateDiscountedPrice(promo.productPrice, promo.productPromotion)}
                    </Box>
                  </Stack>

                  <Button
                    variant="contained"
                    color="secondary"
                    className="promo2-mini-btn"
                    onClick={() => handleOrder(promo)}
                  >
                    Order
                  </Button>

                  <Box
                    component="img"
                    src={`${serverApi}/${promo.productImages[0]}`}
                    alt={promo.productName}
                    className="promo2-mini-img"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* horizontal scroll deals */}
          <Box className="promo2-strip">
            <Box className="promo2-strip-title">More Deals</Box>

            {/* viewport */}
            <Box className="promo2-marquee">
              {/* moving track */}
              <Box className="promo2-track">
                {[...otherPromos, ...promo30.slice(2)].map((promo) => (
                  <Box key={promo._id} className="promo2-dealCard">
                    <Box className="promo2-dealOff">-{promo.productPromotion}%</Box>
                    <Box className="promo2-dealName">{promo.productName}</Box>
                    <Box className="promo2-dealDesc">
                      {promo.productDesc || 'Limited time deal'}
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="baseline"
                      mt={1}
                    >
                      <Box className="promo2-dealOld">${promo.productPrice.toFixed(2)}</Box>
                      <Box className="promo2-dealNew">
                        ${calculateDiscountedPrice(promo.productPrice, promo.productPromotion)}
                      </Box>
                    </Stack>

                    <Button
                      variant="contained"
                      color="secondary"
                      className="promo2-dealBtn"
                      onClick={() => handleOrder(promo)}
                    >
                      Order
                    </Button>

                    <Box
                      component="img"
                      src={`${serverApi}/${promo.productImages[0]}`}
                      alt={promo.productName}
                      className="promo2-dealImg"
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}

export default Promotions;
