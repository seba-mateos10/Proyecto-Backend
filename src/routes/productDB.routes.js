import { Router } from "express";
import ProductManagerDB from "../controllers/ProductManagerDB.js";
//import { verifyToken, handlePolicies } from '../utils.js';
import { handlePolicies } from "../utils.js";

const router = Router();

const manager = new ProductManagerDB();

router.param("id", async (req, res, next, id) => {
  if (!config.MONGODB_ID_REGEX.test(req.params.id)) {
    return res
      .status(400)
      .send({ origin: config.SERVER, payload: null, error: "Id no válido" });
  }

  next();
});

router.get("/", async (req, res) => {
  const limit = +req.query.limit || 10;
  const page = +req.query.page || 1;
  const sort = req.query.sort;
  const query = req.query.query;
  const products = await manager.getProducts(limit, page, sort, query);
  if (products) {
    res.status(200).send({ status: "Ok", payload: products });
  } else {
    res.status(400).send({ status: "Not Ok", payload: [] });
  }
});

router.get("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await manager.getOneProduct({ _id: pid });
  if (product !== undefined) {
    res.status(200).send({ status: "Ok", payload: product });
  } else {
    res
      .status(400)
      .send({
        status: "Not Ok",
        payload: [],
        error: "El producto buscado no existe.",
      });
  }
});

router.post("/", handlePolicies(["admin"]), async (req, res) => {
  const socketServer = req.app.get("socketServer");
  const prodAdd = req.body;
  const rta = await manager.addProduct(prodAdd);
  res
    .status(200)
    .send({
      status: "Ok",
      payload: rta,
      mensaje: `Producto con código ${rta.code}, agregado OK`,
    });
  socketServer.emit("newProduct", rta);
});

router.put("/:pid", handlePolicies("admin"), async (req, res) => {
  const pid = req.params.pid;
  const prodUp = req.body;
  const rta = await manager.updateProduct(pid, prodUp);
  if (rta === 0) {
    res
      .status(200)
      .send({
        status: "Ok",
        payload: prodUp,
        mensaje: `Producto con id ${pid}, fue modificado.`,
      });
  } else {
    res
      .status(400)
      .send({
        status: "Not Ok",
        payload: [],
        error: `No se encontro el producto con id ${pid} para ser editado.`,
      });
  }
});

router.delete("/:pid", handlePolicies("admin"), async (req, res) => {
  const socketServer = req.app.get("socketServer");
  const pid = req.params.pid;
  const rta = await manager.deleteProduct(pid);
  res
    .status(200)
    .send({
      status: "Ok",
      payload: [],
      mensaje: `Producto con id ${pid}, fue borrado.`,
    });
  const prodRender = await manager.getProducts(0);
  socketServer.emit("deleteProduct", prodRender);
});

router.all("*", async (req, res) => {
  res
    .status(404)
    .send({
      origin: config.SERVER,
      payload: null,
      error: "No se encuentra la ruta solicitada",
    });
});

export default router;
