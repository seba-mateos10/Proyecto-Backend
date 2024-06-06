import { Router } from "express";
import {
  Login,
  cartIdView,
  chatView,
  homeView,
  loginGET,
  logout,
  prodcuctsView,
  realTimeProductsView,
  registerGET,
  registerPost,
} from "../controllers/views.controllers.js";
import { admin, auth } from "../middleware/auth.js";
import passport from "passport";

const router = Router();

router.get("/", homeView);
router.get("/realtimeproducts", [auth, admin], realTimeProductsView);
router.get("/chat", auth, chatView);
router.get("/products", auth, prodcuctsView);
router.get("/cart/:cid", auth, cartIdView);
router.get("/login", loginGET);
router.get("/register", registerGET);
router.get("/logout", logout);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  registerPost
);
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  Login
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);
router.get(
  "/api/sessions/githubcallback",
  passport.authenticate("github", { failureRedirect: "/register" }),
  Login
);

export default router;
