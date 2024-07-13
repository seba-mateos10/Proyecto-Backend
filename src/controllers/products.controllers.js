import { request, response } from "express";
import { ProductsRepository } from "../repositories/index.js";

export const getProducts = async (req = request, res = response) => {
  try {
    // const result = await getProductsService({ ...req.query });
    const result = await ProductsRepository.getProducts({ ...req.query });

    return res.json({ result });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const getProductById = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    // const producto = await getProductByIdService(pid);
    const producto = await ProductsRepository.getProductById(pid);
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
    const { title, description, price, code, stock, category } = req.body;

    if ((!title, !description, !price, !code, !stock, !category))
      return res.status(404).json({
        msg: "los campos [title,description,code,price,stock,category] son obligatorios",
      });

    // const existCode = await getProductByCodeService(code)
    const existCode = await ProductsRepository.getProductByCode(code);

    if (existCode)
      return res
        .status(400)
        .json({ msj: "El codigo ingresado ya existe en un producto" });

    if (req.file) {
      const isValidExtension = validFileExtension(req.file.originalname);

      if (!isValidExtension) {
        return res
          .status(400)
          .json({ msg: "La extension del archivo no es valida" });
      }

      const { secure_url } = await cloudinary.uploader.upload(req.file.path);
      req.body.thumbnail = secure_url;
    }

    // const producto = await addProductService({ ...req.body });
    const producto = await ProductsRepository.addProduct({ ...req.body });

    return res.json({ producto });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const updateProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    const { _id, ...rest } = req.body;

    // const product = await getProductByIdService(pid)
    const product = await ProductsRepository.getProductById(pid);

    if (!product)
      return res
        .status(400)
        .json({ msj: `El producto con id ${pid} no existe!` });

    if (req.file) {
      const isValidExtension = validFileExtension(req.file.originalname);

      if (!isValidExtension)
        return res
          .status(400)
          .json({ msg: "La extension del archivo no es valida" });

      if (product.thumbnails) {
        const url = product.thumbnails.split("/");
        const nombre = url[url.length - 1];
        const [id] = nombre.split(".");
        cloudinary.uploader.destroy(id);
      }

      const { secure_url } = await cloudinary.uploader.upload(req.file.path);
      rest.thumbnail = secure_url;
    }

    // const producto = await updateProductService(pid, rest);
    const producto = await ProductsRepository.updateProduct(pid, rest);

    if (producto) return res.json({ msg: "Producto Actualizado", producto });
    return res
      .status(404)
      .json({ msg: `No se pudo actualizar el producto con id ${pid}` });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
    const { pid } = req.params;
    // const producto = await deleteProductService(pid);
    const producto = await ProductsRepository.deleteProduct(pid);
    if (producto) return res.json({ msg: "Producto Eliminado", producto });
    return res
      .status(404)
      .json({ msg: `No se pudo eliminar el producto con id ${pid}` });
  } catch (error) {
    console.log("deleteproduct ->", error);
    return res.status(500).json({ msg: "Hablar con un administrador" });
  }
};
