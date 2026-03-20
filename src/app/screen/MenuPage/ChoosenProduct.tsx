import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import {
  Box,
  Container,
  Stack,
  Button,
  Rating,
  TextField,
  InputAdornment,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import { Product } from "../../../lib/types/product";
import {
  retrieveChosenProduct,
  retrieveProducts,
  retrieveProductsCache,
} from "./selector";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";
import { setProducts, setChosenProduct, cacheProducts } from "./slice";
import "../../../css/menu.css";
import { useGlobals } from "../../hooks/useGlobals";
import ReviewService, { Review } from "../../services/ReviewService";
import useBusket from "../../hooks/useBusket";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function ChoosenProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const { productId } = useParams<{ productId: string }>();
  const products = useSelector(retrieveProducts);
  const productsCache = useSelector(retrieveProductsCache);
  const chosenProduct = useSelector(retrieveChosenProduct);
  const { authMember } = useGlobals();
  const { onAdd } = useBusket();
  const [loading, setLoading] = useState(false);
  const [activeImg, setActiveImg] = useState("/imgs/default_img.jpg");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsLimit, setReviewsLimit] = useState(3);

  useEffect(() => {
    if (!productId) return;

    const cached = products.find((p) => p._id === productId);
    if (cached) {
      dispatch(setChosenProduct(cached));
      const cachedImages = cached.productImages?.length
        ? cached.productImages.map((img) => `${serverApi}/${img}`)
        : ["/imgs/default_img.jpg"];
      setActiveImg(cachedImages[0]);
    }

    const updateProductInStore = (data: Product) => {
      const updatedList = products.map((p) => (p._id === data._id ? data : p));
      if (updatedList.length) {
        dispatch(setProducts(updatedList));
      }

      if (productsCache && Object.keys(productsCache).length > 0) {
        Object.keys(productsCache).forEach((key) => {
          const list = productsCache[key];
          if (!list) return;
          const updated = list.map((p) => (p._id === data._id ? data : p));
          dispatch(cacheProducts({ queryKey: key, products: updated }));
        });
      }
    };

    const fetchProduct = async () => {
      try {
        setLoading(!cached);
        const productService = new ProductService();
        const data = await productService.getProduct(productId);
        dispatch(setChosenProduct(data));
        updateProductInStore(data);
        const fetchedImages = data.productImages?.length
          ? data.productImages.map((img) => `${serverApi}/${img}`)
          : ["/imgs/default_img.jpg"];
        setActiveImg(fetchedImages[0]);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, dispatch]);

  useEffect(() => {
    if (!chosenProduct) return;
    if (chosenProduct.productImages?.length) {
      setActiveImg(`${serverApi}/${chosenProduct.productImages[0]}`);
    }
  }, [chosenProduct]);

  useEffect(() => {
    setReviewsLimit(3);
    setReviews([]);
    setReviewsTotal(0);
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const reviewService = new ReviewService();
        const data = await reviewService.getProductReviews(
          productId,
          1,
          reviewsLimit,
        );
        setReviews(data.items || []);
        setReviewsTotal(data.total || 0);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [productId, reviewsLimit]);

  if (loading && !chosenProduct) {
    return (
      <div className="cp-section">
        <Container className="cp-container">
          <Box sx={{ textAlign: "center", py: 6 }}>Loading product...</Box>
        </Container>
      </div>
    );
  }

  if (!chosenProduct) {
    return (
      <div className="cp-section">
        <Container className="cp-container">
          <Box sx={{ textAlign: "center", py: 6 }}>Product not found</Box>
          <Button
            className="cp-back"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/products")}
          >
            Back to Menu
          </Button>
        </Container>
      </div>
    );
  }

  const images = chosenProduct.productImages?.length
    ? chosenProduct.productImages.map((img) => `${serverApi}/${img}`)
    : ["/imgs/default_img.jpg"];

  const handleAddToCart = () => {
    if (!authMember) {
      sweetErrorHandling({ message: "Please sign up first" });
      return;
    }

    onAdd({
      _id: chosenProduct._id,
      quantity: 1,
      name: chosenProduct.productName,
      price: chosenProduct.discountedPrice || chosenProduct.productPrice,
      image: chosenProduct.productImages?.[0],
    });

    sweetTopSmallSuccessAlert(chosenProduct.productName);
  };

  return (
    <div className="cp-section">
      <Container className="cp-container">
        {/* TOP BAR */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="cp-topbar"
        >
          <Button
            className="cp-back"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/products")}
          >
            Back
          </Button>

          <Stack direction="row" spacing={1}>
            <Box className="cp-pill">
              <LocalFireDepartmentRoundedIcon />
              <span>Best Seller</span>
            </Box>
            <Box className="cp-pill">
              <AccessTimeRoundedIcon />
              <span>Ready in 15 min</span>
            </Box>
          </Stack>
        </Stack>

        {/* MAIN GRID */}
        <Box className="cp-grid">
          {/* LEFT: GALLERY */}
          <Box className="cp-left">
            <Box className="cp-gallery">
              {/* IMAGE */}
              <Box className="cp-mainImgWrap">
                <Box
                  component="img"
                  src={activeImg}
                  alt="product"
                  className="cp-mainImg"
                  decoding="async"
                  fetchPriority="high"
                />
                {/* FLOAT ICONS */}
                <Stack direction="row" spacing={1} className="cp-floatIcons">
                  <Box className="cp-miniPill">
                    <FavoriteBorderRoundedIcon />
                    <span>{chosenProduct.productLikes}</span>
                  </Box>
                  <Box className="cp-miniPill">
                    <RemoveRedEyeRoundedIcon />
                    <span>{chosenProduct.productViews}</span>
                  </Box>
                </Stack>
              </Box>

              {/* THUMBS */}
              <Stack direction="row" spacing={1.4} className="cp-thumbs">
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    className={`cp-thumb ${activeImg === img ? "active" : ""}`}
                    role="button"
                    onClick={() => setActiveImg(img)}
                  >
                    <Box
                      component="img"
                      src={img}
                      alt="thumb"
                      loading="lazy"
                      decoding="async"
                    />
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* DETAILS */}
            <Box className="cp-details">
              <Box className="cp-title">{chosenProduct.productName}</Box>

              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                className="cp-meta"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating
                    name={`rating-${chosenProduct._id}`}
                    value={Number(chosenProduct.productRank) || 0}
                    readOnly
                    size="medium"
                  />
                  <Box className="cp-rev">
                    ({chosenProduct.productReviewCount || 0} reviews)
                  </Box>
                </Stack>

                <Box className="cp-dot" />

                <Box className="cp-sub">Delizioso Restaurant • Seoul</Box>
              </Stack>

              <Box className="cp-desc">
                {chosenProduct.productDesc || "Delicious item from our menu"}
              </Box>

              {/* OPTIONS (hard-coded UI) */}
              <Stack direction="row" spacing={2} className="cp-options">
                <TextField
                  size="small"
                  className="cp-note"
                  placeholder="Add a note (no onion, extra cheese...)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="cp-noteIcon">✎</Box>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box className="cp-tags">
                  <Box className="cp-tag">Italian</Box>
                  <Box className="cp-tag">Pasta</Box>
                  <Box className="cp-tag">Chef Special</Box>
                </Box>
              </Stack>

              {/* REVIEWS */}
              <Box sx={{ mt: 4 }}>
                <Box sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
                  Latest Reviews
                </Box>

                {reviewsLoading ? (
                  <Box sx={{ color: "#666", py: 2 }}>Loading reviews...</Box>
                ) : reviews.length === 0 ? (
                  <Box sx={{ color: "#666", py: 2 }}>No reviews yet</Box>
                ) : (
                  <Stack spacing={2}>
                    {reviews.map((review) => {
                      const avatar = review.memberId?.memberImage
                        ? `${serverApi}/${review.memberId.memberImage}`
                        : "/imgs/default_img.jpg";
                      return (
                        <Box
                          key={review._id}
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box
                            component="img"
                            src={avatar}
                            alt={review.memberId?.memberNick || "User"}
                            loading="lazy"
                            decoding="async"
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Box sx={{ fontWeight: 700 }}>
                                {review.memberId?.memberNick || "Anonymous"}
                              </Box>
                              <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                              />
                              <Box sx={{ color: "#888", fontSize: 12 }}>
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </Box>
                            </Stack>
                            <Box sx={{ color: "#555", mt: 0.5 }}>
                              {review.comment || "Great food and service!"}
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                )}

                {reviewsTotal > reviews.length && !reviewsLoading && (
                  <Button
                    variant="text"
                    sx={{ mt: 2 }}
                    onClick={() => setReviewsLimit(reviewsTotal)}
                  >
                    View more reviews
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          {/* RIGHT: CHECKOUT PANEL */}
          <Box className="cp-right">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                p: 3,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                height: "fit-content",
                minHeight: 200,
              }}
            >
              <Box sx={{ fontSize: 28, fontWeight: 700, color: "#333" }}>
                ₩
                {(
                  chosenProduct.discountedPrice || chosenProduct.productPrice
                ).toFixed(2)}
              </Box>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
              >
                Add to Basket
              </Button>
              <Box sx={{ color: "#666", fontSize: 14, textAlign: "center" }}>
                {authMember ? "Ready to order" : "Sign up to order"}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default ChoosenProduct;
