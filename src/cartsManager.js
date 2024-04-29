import fs from "fs";
import ProductManager from "./productManager.js";

class CartsManager {
  #carts;
  #path;

  constructor() {
    this.#path = "./src/data/carritos.json";
    this.#carts = this.#leerCarritosInFile();
  }

  #asignarIdCart() {
    let id = 1;
    if (this.#carts.length != 0) {
      id = this.#carts[this.#carts.length - 1].id + 1;
      return id;
    }
  }

  #leerCarritosInFile() {
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
      fs.writeFileSync(this.#path, JSON.stringify(this.#carts));
    } catch (error) {
      console.log(
        `ocurrio un error al momento de guardar el archivo de productos, ${error}`
      );
    }
  }

  createCart() {
    const newCart = {
      id: this.#asignarIdCart(),
      products: [],
    };

    this.#carts.push(newCart);
    this.#guardarArchivo();

    return newCart;
  }

  getCartById(id) {
    const producto = this.#carts.find((p) => p.id == id);
    if (producto) return producto;
    else return `Not found del producto con id ${id}`;
  }

  addProductInCart(cid, pid) {
    let respuesta = `El carrito con id ${cid} no existe!`;
    const indexCarrito = this.#carts.findIndex((c) => c.id === cid);

    if (indexCarrito !== -1) {
      const indexProductoInCart = this.#carts[indexCarrito].products.findIndex(
        (p) => p.id === pid
      );
      const p = new ProductManager();
      const producto = p.getProductById(pid);

      if (producto.status && indexProductoInCart === -1) {
        this.#carts[indexCarrito].products.push({ id: pid, quantity: 1 });
        this.#guardarArchivo();
        respuesta = "Prodcuto agregado al carrito";
      } else if (producto.status && indexProductoInCart !== -1) {
        ++this.#carts[indexCarrito].products[indexProductoInCart].quantity;
        this.#guardarArchivo();
        respuesta = "Producto agregado al carrito";
      } else {
        respuesta = `El producto con id ${pid} no existe!`;
      }
    }

    return respuesta;
  }
}

export default CartsManager;
