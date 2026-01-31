import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;
  constructor() {
    this.path = serverApi;
  }

  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    try {
      let url = `${this.path}/product/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;
      if (input.productCollection)
        url += `&productCollection=${input.productCollection}`;
      if (input.search) url += `&search=${input.search}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getProducts:", result);

      return result.data;
    } catch (err) {
      console.log("ProductService - getProducts error:", err);
      throw err;
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    try {
      const url = `${this.path}/product/${productId}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getProduct:", result);

      return result.data;
    } catch (err) {
      console.log("ProductService - getProduct error:", err);
      throw err;
    }
  }

  public async likeProduct(productId: string): Promise<any> {
    try {
      const url = `${this.path}/product/like/${productId}`;
      const result = await axios.post(url, {}, { withCredentials: true });
      console.log("likeProduct response:", result.data);

      return result.data;
    } catch (err) {
      console.log("ProductService - likeProduct error:", err);
      throw err;
    }
  }

  public async getFavoriteProducts(input: ProductInquiry): Promise<Product[]> {
    try {
      let url = `${this.path}/product/favorites?order=${input.order}&page=${input.page}&limit=${input.limit}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getFavoriteProducts:", result.data);

      return result.data;
    } catch (err) {
      console.log("ProductService - getFavoriteProducts error:", err);
      throw err;
    }
  }
}

export default ProductService;
