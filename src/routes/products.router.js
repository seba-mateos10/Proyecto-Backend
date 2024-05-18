import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/products.controllers.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", addProduct);
router.put("/:pid", updateProduct);
router.delete("/", deleteProduct);

export default router;
