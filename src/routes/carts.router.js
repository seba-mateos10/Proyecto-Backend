import { Router, request, response } from "express";
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

router.post("/:cid/purchase", async (req = request, res = response) => {
  try {
    res
      .status(200)
      .send({ origin: config.SERVER, payload: "Quiere confirmar la compra" });
  } catch (error) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: error.message });
  }
});

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
