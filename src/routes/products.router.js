import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();

router.get("/products", (req, res) => {
  const { limit } = req.query;
  const p = new ProductManager();
  return res.json({ productos: p.getProducts(limit) });
});

router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const p = new ProductManager();
  return res.json({ producto: p.getProductById(Number(pid)) });
});

router.post("/", (req, res) => {
  const p = new ProductManager();
  const result = p.addProduct({ ...req.body });
  return res.json({ result });
});

router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const p = new ProductManager();
  const result = p.updateProduct(Number(pid), req.body);
  return res.json({ result });
});

router.delete("/", async (req, res) => {
  const { pid } = req.params;
  const p = new ProductManager();
  const result = p.deleteProduct(Number(pid));
  return res.json({ result });
});

export default router;
