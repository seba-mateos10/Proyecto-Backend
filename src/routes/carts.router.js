import { Router } from "express";
import { check } from "express-validator";
import {
  addProductInCart,
  deleteProductsInCart,
  getCartById,
  updateProductsInCart,
} from "../controllers/carts.controllers.js";
import { validarCampos, validarJWT } from "../middleware/auth.js";

const router = Router();

router.get(
  "/:cid",
  [
    validarJWT,
    check("cid", "No es valido el ID del carrito").isMongoId(),
    validarCampos,
  ],
  getCartById
);
// router.post("/", validarJWT, createCart);
router.post(
  "/:cid/product/:pid",
  [
    validarJWT,
    check("cid", "No es valido el ID del carrito").isMongoId(),
    check("pid", "No es valido el ID del producto").isMongoId(),
    validarCampos,
  ],
  addProductInCart
);

router.delete(
  "/:cid/products/:pid",
  [
    validarJWT,
    check("cid", "No es valido el ID del carrito").isMongoId(),
    check("pid", "No es valido el ID del producto").isMongoId(),
    validarCampos,
  ],
  deleteProductsInCart
);

router.put(
  "/:cid/products/:pid",
  [
    validarJWT,
    check("cid", "No es valido el ID del carrito").isMongoId(),
    check("pid", "No es valido el ID del producto").isMongoId(),
    validarCampos,
  ],
  updateProductsInCart
);
// router.delete("/:cid", validarJWT, deleteCart);

export { router as cartsRouter };
