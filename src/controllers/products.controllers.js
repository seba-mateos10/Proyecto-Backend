import { request, response } from "express";
import { productModel } from "../models/products.js";

export const getProducts = async (req = request, res = response) => {
  try {
    const { limit } = req.query;
    const productos = await productModel.find().limit(Number(limit));
    return res.json({ productos });
  } catch (error) {
    console.log("getproducts ->", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const getProductById = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const producto = await productModel.findById(pid);
    if (!producto)
      return res.status(404).json({ msg: `Producto con id ${pid} no existe` });
    return res.json({ producto });
  } catch (error) {
    console.log("getproductById ->", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const addProduct = async (req = request, res = response) => {
  try {
    const {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status,
    } = req.body;
    if ((!title, !description, !price, !code, !stock, !category))
      return res.status(404).json({
        msg: "los campos [title,description,code,price,stock,category] son obligatorios",
      });

    const producto = await productModel.create({
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status,
    });

    return res.json({ producto });
  } catch (error) {
    console.log("addproduct ->", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const updateProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const { _id, ...rest } = req.body;
    const producto = await productModel.findByIdAndUpdate(
      pid,
      { ...rest },
      { new: true }
    );

    if (producto) return res.json({ msg: "Producto Actualizado", producto });
    return res
      .status(404)
      .json({ msg: `No se pudo actualizar el producto con id ${pid}` });
  } catch (error) {
    console.log("updateproduct ->", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const producto = await productModel.findByIdAndDelete(pid);
    if (producto) return res.json({ msg: "Producto Eliminado", producto });
    return res
      .status(404)
      .json({ msg: `No se pudo eliminar el producto con id ${pid}` });
  } catch (error) {
    console.log("deleteproduct ->", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};
