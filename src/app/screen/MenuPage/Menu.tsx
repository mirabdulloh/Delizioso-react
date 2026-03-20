import React, { useDeferredValue, useEffect, useRef, useState } from "react";
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

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { UpdateProductLikePayload } from "../../../lib/types/screen";
import ProductService from "../../services/ProductService";
import { setProducts, cacheProducts } from "./slice";
import {
  retrieveProducts,
  retrieveProductsCache,
  retrieveLastFetch,
} from "./selector";
import { updateProductLike } from "./likesSlice";
import { resolveMediaUrl } from "../../../lib/config";
import { addToCart } from "../OrderOnline/slice";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import { scrollToSectionTop } from "../../../lib/scroll";

import "../../../css/menu.css";

/** REDUX SLICE AND SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
  cacheProducts: (payload: { queryKey: string; products: Product[] }) =>
    dispatch(cacheProducts(payload)),
  updateProductLike: (payload: UpdateProductLikePayload) =>
    dispatch(updateProductLike(payload)),
  addToCart: (item: any) => dispatch(addToCart(item)),
});

const menuPageRetriever = createSelector(
  retrieveProducts,
  retrieveProductsCache,
  retrieveLastFetch,
  (products, productsCache, lastFetch) => ({
    products,
    productsCache,
    lastFetch,
  }),
);

const Menu = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {
    setProducts: setProductsAction,
    cacheProducts: cacheProductsAction,
    updateProductLike: updateProductLikeAction,
    addToCart: addToCartAction,
  } = actionDispatch(useDispatch());
  const { products, productsCache, lastFetch } = useSelector(menuPageRetriever);
  const { authMember } = useGlobals();

  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredLikeId, setHoveredLikeId] = useState<string | null>(null);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 8;
  const deferredSearchQuery = useDeferredValue(searchQuery.trim());

  const categories = [
    "All Category",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Drink",
    "Favorite",
  ];

  // Map category names to enum values
  const categoryToEnum = (category: string): ProductCollection | undefined => {
    const mapping: { [key: string]: ProductCollection } = {
      Breakfast: ProductCollection.BREAKFAST,
      Lunch: ProductCollection.LUNCH,
      Dinner: ProductCollection.DINNER,
      Drink: ProductCollection.DRINK,
    };
    return mapping[category];
  };

  const queryKey = `${selectedCategory}-${deferredSearchQuery}-${currentPage}`;
  const cachedProducts = productsCache[queryKey];
  const visibleProducts = cachedProducts ?? products;

  // Check if we have cached products
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const isCached =
    lastFetch[queryKey] &&
    Date.now() - lastFetch[queryKey] < CACHE_DURATION &&
    cachedProducts;

  useEffect(() => {
    // If we have valid cached products, use them
    if (isCached) {
      console.log("Using cached products for:", queryKey);
      setTotalPages(
        cachedProducts.length < itemsPerPage ? currentPage : currentPage + 1,
      );
    } else {
      console.log("Loading products from API for:", queryKey);
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productService = new ProductService();

      // Handle Favorite category separately
      if (selectedCategory === "Favorite") {
        try {
          const inquiry = {
            page: currentPage,
            limit: itemsPerPage,
            order: "createdAt",
          };
          const result = await productService.getFavoriteProducts(inquiry);
          console.log("Favorite products from API:", result);
          setProductsAction(result);
          cacheProductsAction({ queryKey, products: result });
          setTotalPages(
            result.length < itemsPerPage ? currentPage : currentPage + 1,
          );
        } catch (err) {
          console.error("Error loading favorite products:", err);
          // If no favorites, show empty
          setProductsAction([]);
          cacheProductsAction({ queryKey, products: [] });
          setTotalPages(1);
        }
        return;
      }

      // Handle other categories
      const inquiry = {
        page: currentPage,
        limit: itemsPerPage,
        order: "createdAt",
        search: deferredSearchQuery || undefined,
        productCollection:
          selectedCategory !== "All Category"
            ? categoryToEnum(selectedCategory)
            : undefined,
      };

      const result = await productService.getProducts(inquiry);
      console.log("🔍 Products from API:", result);
      setProductsAction(result);
      cacheProductsAction({ queryKey, products: result });
      setTotalPages(
        result.length < itemsPerPage ? currentPage : currentPage + 1,
      );
    } catch (err) {
      console.error("Error loading products:", err);
      // Clear products instead of showing alert when there's no data
      setProductsAction([]);
      cacheProductsAction({ queryKey, products: [] });
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    scrollToSectionTop(sectionRef.current);
  };

  const handleLikeProduct = async (product: Product) => {
    try {
      const productService = new ProductService();
      const result = await productService.likeProduct(product._id);

      console.log("API Response for like:", result);

      // Update likes cache
      updateProductLikeAction({
        productId: product._id,
        liked: result.memberLiked,
        likesCount: result.productLikes,
      });

      // ✅ IMPORTANT: Update the CACHE with new like count
      const updatedCachedProducts = visibleProducts.map((p) =>
        p._id === product._id
          ? {
              ...p,
              memberLiked: result.memberLiked,
              productLikes: result.productLikes,
            }
          : p,
      );

      // If user is in Favorite category and unlikes a product, remove it from the list
      if (selectedCategory === "Favorite" && !result.memberLiked) {
        setProductsAction(updatedCachedProducts.filter((p) => p._id !== product._id));
        // ✅ Also update cache
        cacheProductsAction({
          queryKey,
          products: updatedCachedProducts.filter((p) => p._id !== product._id),
        });
      } else {
        // Otherwise just update the product in store AND cache
        setProductsAction(updatedCachedProducts);
        // ✅ Update the cache with new like count
        cacheProductsAction({
          queryKey,
          products: updatedCachedProducts,
        });
      }
    } catch (err: unknown) {
      console.error("Error liking product:", err);
      sweetErrorHandling(err as Error);
    }
  };

  const showInitialLoading = loading && visibleProducts.length === 0;
  const showRefreshing = loading && visibleProducts.length > 0;

  return (
    <div ref={sectionRef} className="menu2-section">
      <Container>
        <Box className="menu2-title">Menu</Box>

        {/* search left under title */}
        <Box className="menu2-topbar">
          <TextField
            className="menu2-search"
            placeholder="Search your favorite food..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentPage !== 1) {
                setCurrentPage(1);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {showRefreshing && (
          <Box sx={{ textAlign: "center", color: "#888", fontSize: "0.95rem", mb: 2 }}>
            Updating products...
          </Box>
        )}

        {/* categories (full-width under search) */}
        <Stack
          direction="row"
          spacing={2}
          className="menu2-cats"
        >
          {categories.map((c) => (
            <Button
              key={c}
              className={`menu2-cat ${c === selectedCategory ? "active" : ""}`}
              onClick={() => {
                if (c === selectedCategory) return;
                setSelectedCategory(c);
                if (currentPage !== 1) {
                  setCurrentPage(1);
                }
              }}
            >
              {c}
            </Button>
          ))}
        </Stack>

        {/* layout changes by cartOpen */}
        <Box className="menu2-layout no-cart">
          {/* LEFT */}
          <Box className="menu2-left">
            {showInitialLoading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>Loading products...</Box>
            ) : visibleProducts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>There is no product for that category for now</Box>
            ) : (
              <Box className="menu2-grid cols-4">
                {visibleProducts.map((product) => (
                  <Box
                    key={product._id}
                    className="menu2-card"
                    role="button"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {/* icons */}
                    <Box className="menu2-icons">
                      <Box
                        className="menu2-pill"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeProduct(product);
                        }}
                        onMouseEnter={() => setHoveredLikeId(product._id)}
                        onMouseLeave={() => setHoveredLikeId(null)}
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(0,0,0,0.1)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                          },
                          "&:active": {
                            transform: "scale(0.95)",
                          },
                        }}
                      >
                        {product.memberLiked ||
                        hoveredLikeId === product._id ? (
                          <FavoriteRoundedIcon
                            sx={{
                              fontSize: "18px",
                              color: "#ff4757",
                              transition: "all 0.3s ease",
                            }}
                          />
                        ) : (
                          <FavoriteBorderRoundedIcon
                            sx={{
                              fontSize: "18px",
                              color: "#999",
                              transition: "all 0.3s ease",
                            }}
                          />
                        )}
                        <span
                          style={{
                            marginLeft: "0px",
                            fontWeight: product.memberLiked ? 700 : 500,
                            fontSize: "14px",
                            color: product.memberLiked
                              ? "#ff4757"
                              : hoveredLikeId === product._id
                                ? "#ff4757"
                                : "#999",
                            transition: "all 0.3s ease",
                            display: "inline-block",
                          }}
                        >
                          {product.productLikes}
                        </span>
                      </Box>
                      <Box
                        className="menu2-pill"
                        sx={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(0,0,0,0.1)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        <VisibilityOutlinedIcon
                          sx={{ fontSize: "18px", color: "#666" }}
                        />
                        <span
                          style={{
                            marginLeft: "4px",
                            fontSize: "14px",
                            color: "#666",
                          }}
                        >
                          {product.productViews}
                        </span>
                      </Box>
                    </Box>

                    <Box className="menu2-imgWrap">
                      <Box
                        component="img"
                        src={resolveMediaUrl(product.productImages[0])}
                        alt={product.productName}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>,
                        ) => {
                          (e.target as HTMLImageElement).src =
                            "/imgs/default_img.jpg";
                        }}
                      />
                    </Box>

                    <Box className="menu2-name">{product.productName}</Box>

                    <Box className="menu2-rating">
                      <Rating
                        name={`rating-${product._id}`}
                        value={Number(product.productRank) || 0}
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
                        ({product.productReviewCount || 0} reviews)
                      </Box>
                    </Box>

                    <Box className="menu2-desc">
                      {product.productDesc || "Delicious item from our menu"}
                    </Box>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      className="menu2-foot"
                    >
                      <Box className="menu2-price">
                        ₩
                        {product.discountedPrice
                          ? product.discountedPrice.toFixed(2)
                          : product.productPrice.toFixed(2)}
                      </Box>
                      <Button
                        variant="contained"
                        color="secondary"
                        className="menu2-order"
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!authMember) {
                            sweetErrorHandling({
                              message: "Please sign up first",
                            });
                            return;
                          }
                          const cartItem = {
                            _id: product._id,
                            quantity: 1,
                            name: product.productName,
                            price:
                              product.discountedPrice || product.productPrice,
                            image: product.productImages[0],
                          };
                          addToCartAction(cartItem);
                          sweetTopSmallSuccessAlert(product.productName, 1000);
                          setClickedButton(product._id);
                          setTimeout(() => setClickedButton(null), 1200);
                        }}
                        sx={{
                          transition: "all 0.3s ease",
                          transform:
                            clickedButton === product._id
                              ? "scale(0.95)"
                              : "scale(1)",
                          "&:active": {
                            transform: "scale(0.95)",
                          },
                        }}
                      >
                        {clickedButton === product._id ? "Added!" : "Order now"}
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Box>
            )}

            {!loading && visibleProducts.length > 0 && totalPages > 1 && (
              <Box className="menu2-paginationWrap" sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  className="menu2-pagination"
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
        </Box>
      </Container>
    </div>
  );
};

export default Menu;
