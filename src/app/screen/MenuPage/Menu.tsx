import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Container,
  Button,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { useDispatch, useSelector } from "react-redux";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import ProductService from "../../services/ProductService";
import { 
  cacheProducts, 
  updateProductLike, 
  selectCachedProducts 
} from "./slice";
import { serverApi } from "../../../lib/config";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";

import "../../../css/menu.css";
import OrderList from "./OrderList";

const Menu = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredLikeId, setHoveredLikeId] = useState<string | null>(null);
  
  // ✅ HARD-CODE: change to true when you want to show cart
  const cartOpen = true; // false = 4 cards, true = 3 cards + cart

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
      "Breakfast": ProductCollection.BREAKFAST,
      "Lunch": ProductCollection.LUNCH,
      "Dinner": ProductCollection.DINNER,
      "Drink": ProductCollection.DRINK,
    };
    return mapping[category];
  };

  const queryKey = `${selectedCategory}-${searchQuery}-1`;
  
  // Use useSelector to get cached products from Redux store
  const cached = useSelector((state: any) => {
    const lastFetch = state.menuPage?.lastFetch?.[queryKey];
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    if (!lastFetch || Date.now() - lastFetch > CACHE_DURATION) {
      return null;
    }
    return state.menuPage?.productsCache?.[queryKey] || null;
  });

  useEffect(() => {
    // If we have cached products, use them
    if (cached && cached.length > 0) {
      console.log("Using cached products for:", queryKey);
      setProducts(cached);
    } else {
      // Otherwise load from API
      console.log("Loading products from API for:", queryKey);
      loadProducts();
    }
  }, [queryKey, cached]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productService = new ProductService();
      
      // Handle Favorite category separately
      if (selectedCategory === "Favorite") {
        try {
          const inquiry = {
            page: 1,
            limit: 12,
            order: "createdAt",
          };
          const result = await productService.getFavoriteProducts(inquiry);
          console.log("Favorite products from API:", result);
          setProducts(result);
          dispatch(cacheProducts({ queryKey, products: result }));
        } catch (err) {
          console.error("Error loading favorite products:", err);
          // If no favorites, show empty
          setProducts([]);
          dispatch(cacheProducts({ queryKey, products: [] }));
        }
        return;
      }
      
      // Handle other categories
      const inquiry = {
        page: 1,
        limit: 12,
        order: "createdAt",
        search: searchQuery || undefined,
        productCollection: selectedCategory !== "All Category" ? categoryToEnum(selectedCategory) : undefined,
      };

      const result = await productService.getProducts(inquiry);
      console.log("Products from API:", result);
      console.log("memberLiked values:", result.map((p: any) => ({ name: p.productName, memberLiked: p.memberLiked })));
      setProducts(result);
      dispatch(cacheProducts({ queryKey, products: result }));
    } catch (err) {
      console.error("Error loading products:", err);
      sweetErrorHandling(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeProduct = async (product: Product) => {
    try {
      const productService = new ProductService();
      const result = await productService.likeProduct(product._id);
      
      console.log("API Response for like:", result);
      console.log("memberLiked:", result.memberLiked);
      console.log("productLikes:", result.productLikes);
      
      // If user is in Favorite category and unlikes a product, remove it from the list
      if (selectedCategory === "Favorite" && !result.memberLiked) {
        setProducts(prevProducts =>
          prevProducts.filter(p => p._id !== product._id)
        );
      } else {
        // Otherwise just update the like status
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p._id === product._id
              ? { ...p, memberLiked: result.memberLiked, productLikes: result.productLikes }
              : p
          )
        );
      }
      
      // Update Redux cache with backend response
      dispatch(updateProductLike({
        productId: product._id,
        liked: result.memberLiked,
        likesCount: result.productLikes,
      }));
      
      sweetTopSmallSuccessAlert(result.memberLiked ? "Added to favorites!" : "Removed from favorites", 1000);
    } catch (err: any) {
      console.error("Error liking product:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.message);
      sweetErrorHandling(err as Error);
    }
  };

  return (
    <div className="menu2-section">
      <Container>
        <Box className="menu2-title">Menu</Box>

        {/* search left under title */}
        <Box className="menu2-topbar">
          <TextField
            className="menu2-search"
            placeholder="Search your favorite food..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* categories (full-width under search) */}
        <Stack
          direction="row"
          spacing={2}
          className="menu2-cats"
          flexWrap="wrap"
        >
          {categories.map((c) => (
            <Button
              key={c}
              className={`menu2-cat ${c === selectedCategory ? "active" : ""}`}
              onClick={() => setSelectedCategory(c)}
            >
              {c}
            </Button>
          ))}
        </Stack>

        {/* layout changes by cartOpen */}
        <Box className={`menu2-layout ${cartOpen ? "with-cart" : "no-cart"}`}>
          {/* LEFT */}
          <Box className="menu2-left">
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>Loading products...</Box>
            ) : products.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>No products found</Box>
            ) : (
              <Box className={`menu2-grid ${cartOpen ? "cols-3" : "cols-4"}`}>
                {products.map((product) => (
                  <Box
                    key={product._id}
                    className="menu2-card"
                    role="button"
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
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(0,0,0,0.1)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                          },
                          '&:active': {
                            transform: 'scale(0.95)',
                          },
                        }}
                      >
                        {product.memberLiked || hoveredLikeId === product._id ? (
                          <FavoriteRoundedIcon sx={{ 
                            fontSize: '18px',
                            color: '#ff4757',
                            transition: 'all 0.3s ease',
                          }} />
                        ) : (
                          <FavoriteBorderRoundedIcon sx={{ 
                            fontSize: '18px',
                            color: '#999',
                            transition: 'all 0.3s ease',
                          }} />
                        )}
                        <span style={{ 
                          marginLeft: '0px', 
                          fontWeight: product.memberLiked ? 700 : 500,
                          fontSize: '14px',
                          color: product.memberLiked ? '#ff4757' : (hoveredLikeId === product._id ? '#ff4757' : '#999'),
                          transition: 'all 0.3s ease',
                          display: 'inline-block',
                        }}>
                          {product.productLikes}
                        </span>
                      </Box>
                      <Box className="menu2-pill" sx={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      }}>
                        <VisibilityOutlinedIcon sx={{ fontSize: '18px', color: '#666' }} />
                        <span style={{ marginLeft: '4px', fontSize: '14px', color: '#666' }}>
                          {product.productViews}
                        </span>
                      </Box>
                    </Box>

                    <Box className="menu2-imgWrap">
                      <Box 
                        component="img" 
                        src={`${serverApi}/${product.productImages[0]}`} 
                        alt={product.productName}
                        onError={(e: any) => {
                          e.target.src = '/imgs/default_img.jpg';
                        }}
                      />
                    </Box>

                    <Box className="menu2-name">{product.productName}</Box>

                    <Box className="menu2-rating">
                      <Rating value={4} readOnly size="small" />
                      <span className="menu2-rev">(0)</span>
                    </Box>

                    <Box className="menu2-desc">{product.productDesc || "Delicious item from our menu"}</Box>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      className="menu2-foot"
                    >
                      <Box className="menu2-price">
                        ₩{product.discountedPrice 
                          ? product.discountedPrice.toFixed(2) 
                          : product.productPrice.toFixed(2)}
                      </Box>

                      <Button
                        variant="contained"
                        color="secondary"
                        className="menu2-order"
                      >
                        Order now
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* RIGHT: only render if cartOpen */}
          {cartOpen ? <OrderList /> : null}
        </Box>
      </Container>
    </div>
  );
};

export default Menu;
