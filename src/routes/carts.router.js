import { Router } from "express";
import {
  addProductInCart,
  createCart,
  deleteCart,
  deleteProductsInCart,
  getCartById,
  updateProductsInCart,
} from "../controllers/carts.controllers.js";

const router = Router();

router.get("/:cid", getCartById);
router.post("/", createCart);
router.post("/:cid/product/:pid", addProductInCart);
router.delete("/:cid/products/:pid", deleteProductsInCart);
router.put("/:cid/products/:pid", updateProductsInCart);
router.delete("/:cid", deleteCart);

export default router;
