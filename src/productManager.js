// const fs = require("fs");
import fs from "fs";

class ProductManager {
  #products;
  #path;

  static #instance;

  constructor() {
    if (ProductManager.#instance) return ProductManager.#instance;
    this.#path = "./src/data/productos.json";
    this.#products = this.#leerProductosInFile();

    ProductManager.#instance = this;
  }

  #asignarIdProducto() {
    let id = 1;
    if (this.#products.length != 0) {
      id = this.#products[this.#products.length - 1].id + 1;
      return id;
    }
  }

  #leerProductosInFile() {
    try {
      if (FileSystem.existsSync(this.#path)) {
        return JSON.parse(fs.readFileSync(this.#path, "utf-8"));
      }

      return [];
    } catch (error) {
      console.log(
        `ocurrio un error al momento de leer el archivo de productos, ${error}`
      );
    }
  }

  #guardarArchivo() {
    try {
      fs.writeFileSync(this.#path, JSON.stringify(this.#products));
    } catch (error) {
      console.log(
        `ocurrio un error al momento de guardar el archivo de productos, ${error}`
      );
    }
  }

  addProduct({
    title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    status = true,
    category,
  }) {
    let result = "Ocurrio un error";

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !status ||
      !category
    )
      result =
        "Todos los parametros son requeridos [title, description, price, code, stock, category] ";
    else {
      const codeRepeat = this.#products.some((p) => p.code == code);
      if (codeRepeat)
        result = `El codigo ${code} ya se encuentra registrado en otro producto`;
      else {
        const id = this.#asignarIdProducto();

        const newProduct = {
          id,
          title,
          description,
          price,
          thumbnails,
          code,
          stock,
          status,
          category,
        };
        this.#products.push(newProduct);
        this.#guardarArchivo();
        result = {
          msg: "Producto agregado exitosamente!",
          producto: newProduct,
        };
      }
    }

    return result;
  }

  getProducts(limit = 0) {
    limit = Number(limit);
    if (limit > 0) {
      return this.#products.slice(0, limit);
    }
    return this.#products;
  }

  getProductById(id) {
    let status = false;
    let resp = `El producto con id ${id} no existe!`;

    const producto = this.#products.find((p) => p.id == id);
    if (producto) {
      status = true;
      resp = producto;
    }
    return { status, resp };
  }

  updateProduct(id, objetoUpdate) {
    let result = `El producto con id ${id} no existe`;

    const index = this.#products.findIndex((p) => p.id === id);

    if (index !== -1) {
      const { id, ...rest } = objetoUpdate;
      const propiedadesPermitidas = [
        "title",
        "description",
        "price",
        "thumbnails",
        "code",
        "stock",
        "status",
        "category",
      ];
      const propiedadesActualizadas = Object.keys(rest)
        .filter((propiedad) => propiedadesPermitidas.includes(propiedad))
        .reduce((obj, key) => {
          obj[key] = rest[key];
          return obj;
        }, {});
      this.#products[index] = {
        ...this.#products[index],
        ...propiedadesActualizadas,
      };
      this.#guardarArchivo();
      result = {
        msg: "Producto actualizado",
        producto: this.#products[index],
      };
    }

    return result;
  }

  deleteProduct(id) {
    let msg = `El producto con id ${id} no existe`;

    const index = this.#products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.#products = this.#products.filter((p) => p.id !== id);
      this.#guardarArchivo();
      msg = "Producto eliminado!";
    }

    return msg;
  }
}

// module.exports = ProductManager;
export default ProductManager;
