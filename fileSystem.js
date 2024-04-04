import { promises as fs } from "fs";

class ProductManager {
  constructor() {
    this.patch = "./productos.txt";
    this.products = [];
  }

  static id = 0;

  addProduct = async (title, description, price, img, code, stock) => {
    ProductManager.id++;
    let newProduct = {
      title,
      description,
      price,
      img,
      code,
      stock,
      id: ProductManager.id,
    };

    this.products.push(newProduct);

    await fs.writeFile(this.patch, JSON.stringify(this.products));
  };

  readProducts = async () => {
    let respuesta = await fs.readFile(this.patch, "utf-8");
    return JSON.parse(respuesta);
  };

  getProducts = async () => {
    let respuesta2 = await this.readProducts();
    return console.log(respuesta2);
  };

  getProductsById = async (id) => {
    let respuesta3 = await this.readProducts();
    if (!respuesta3.find((product) => product.id === id)) {
      console.log("Producto no encontrado");
    } else {
      console.log(respuesta3.find((product) => product.id === id));
    }
  };

  deleteProductsById = async (id) => {
    let respuesta3 = await this.readProducts();
    let productFilter = respuesta3.filter((products) => products.id != id);
    await fs.writeFile(this.patch, JSON.stringify(productFilter));
    console.log("Producto eliminado");
  };

  updateProducts = async ({ id, ...producto }) => {
    await this.deleteProductsById(id);
    let productOld = await this.readProducts();
    let productsModif = [{ ...producto, id }, ...productOld];
    await fs.writeFile(this.patch, JSON.stringify(productsModif));
  };
}

const productos = new ProductManager();

/* productos.addProduct("title1", "Description1", 100, "img1", "a123", 10);
// productos.addProduct("title2", "Description2", 200, "img2", "b123", 20);
// productos.addProduct("title3", "Description3", 300, "img3", "c123", 30); */

// productos.getProducts();

// productos.getProductsById(2);

// productos.deleteProductsById(2);

productos.updateProducts({
  title: "title3",
  description: "Description3",
  price: 350,
  img: "img3",
  code: "c123",
  stock: 30,
  id: 3,
});
