import { request, response } from "express";
import { getProductsService } from "../services/products.js";
import { getCartByIdService } from "../services/carts.js";
import { getUserEmail, registerUser } from "../services/user.js";

export const homeView = async (req = request, res = response) => {
  const limit = 50;
  const { payload } = await getProductsService({ limit });
  const user = req.session.user;

  return res.render("home", {
    productos: payload,
    styles: "styles.css",
    title: "Home",
    user,
  });
};

export const realTimeProductsView = async (req = request, res = response) => {
  const user = req.session.user;
  return res.render("realTimeProducts", {
    title: "Real Time",
    styles: "styles.css",
    user,
  });
};

export const chatView = async (req = request, res = response) => {
  const user = req.session.user;
  return res.render("chat", { styles: "chat.css", title: "Chat", user });
};

export const prodcuctsView = async (req = request, res = response) => {
  const result = await getProductsService({ ...req.query });
  const user = req.session.user;
  return res.render("products", {
    title: "productos",
    result,
    styles: "products.css",
    user,
  });
};

export const cartIdView = async (req = request, res = response) => {
  const { cid } = req.params;
  const carrito = await getCartByIdService(cid);
  const user = req.session.user;
  return res.render("cart", {
    title: "carrito",
    carrito,
    styles: "cart.css",
    user,
  });
};

export const loginGET = async (req = request, res = response) => {
  return res.render("login", { title: "Login", styles: "loginRegister.css" });
};

export const registerGET = async (req = request, res = response) => {
  return res.render("register", {
    title: "Register",
    styles: "loginRegister.css",
  });
};

export const registerPost = async (req = request, res = response) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) return res.redirect("/register");

  const user = await registerUser({ ...req.body });

  if (user) {
    const userName = `${user.name} ${user.lastName}`;
    req.session.user = userName;
    req.session.rol = user.rol;
    return res.redirect("/");
  }

  return res.redirect("/register");
};

export const loginPost = async (req = request, res = response) => {
  const { email, password } = req.body;

  const user = await getUserEmail(email);

  if (user && user.password === password) {
    const userName = `${user.name} ${user.lastName}`;
    req.session.user = userName;
    req.session.rol = user.rol;
    return res.redirect("/");
  }

  return res.redirect("/login");
};

export const logout = async (req = request, res = response) => {
  req.session.destroy((err) => {
    if (err) return res.send({ status: false, body: err });
    else return res.redirect("/login");
  });
};
