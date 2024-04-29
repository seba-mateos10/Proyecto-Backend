import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();

router.get("/", (req, res) => {
  const p = new ProductManager();
  const productos = p.getProducts();
  return res.render("home", { productos, styles: "styles.css" });
});

router.get("/realtimeproducts", (req, res) => {
  return res.render("realTimeProducts");
});

export default router;
