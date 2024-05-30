import { Router } from "express";
import {
  cartIdView,
  chatView,
  homeView,
  loginGET,
  loginPost,
  logout,
  prodcuctsView,
  realTimeProductsView,
  registerGET,
  registerPost,
} from "../controllers/views.controllers.js";
import { admin, auth } from "../middleware/auth.js";

const router = Router();

router.get("/", homeView);
router.get("/realtimeproducts", [auth, admin], realTimeProductsView);
router.get("/chat", auth, chatView);
router.get("/products", auth, prodcuctsView);
router.get("/cart/:cid", auth, cartIdView);

router.get("/login", loginGET);
router.post("/login", loginPost);

router.get("/register", registerGET);
router.post("/register", registerPost);

router.get("/logout", logout);

export default router;
