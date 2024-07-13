import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/products.controllers.js";
import { validarJWT } from "../middleware/auth.js";

const router = Router();

router.get("/", validarJWT, getProducts);
router.get("/:pid", validarJWT, getProductById);
router.post("/", [validarJWT, uploader.single("file")], addProduct);
router.put("/:pid", [validarJWT, uploader.single("file")], updateProduct);
router.delete("/", validarJWT, deleteProduct);

export { router as productsRouter };
