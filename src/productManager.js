import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export class ProductManager {
  constructor() {
    this.path = "products.json";
    this.products = [];
  }

  addProduct = async ({
    title,
    description,
    price,
    img,
    code,
    stock,
    status,
    category,
  }) => {
    const id = uuidv4();

    let newProduct = {
      id,
      title,
      description,
      price,
      img,
      code,
      stock,
      status,
      category,
    };

    this.products = await this.getProducts();
    this.products.push(newProduct);

    await fs.writeFile(this.path, JSON.stringify(this.products));

    return newProduct;
  };

  getProducts = async () => {
    const response = await fs.readFile(this.path, "utf8");
    const responseJSON = JSON.parse(response);

    return responseJSON;
  };

  getProductById = async (id) => {
    const response = this.getProducts();

    const product = response.find((product) => product.id === id);

    if (product) {
      return product;
    } else {
      console.log("Producto no encontrado");
    }
  };

  updateProduct = async (id, { ...data }) => {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);

    if (index != -1) {
      products[index] = { id, ...data };
      await fs.writeFile(this.path, JSON.stringify(products));
      return products[index];
    } else {
      console.log("Producto no encontrado");
    }
  };

  deleteProduct = async (id) => {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);

    if (index != -1) {
      products.splice(index, 1);
      await fs.writeFile(this.path, JSON.stringify(products));
    } else {
      console.log("Producto eliminado");
    }
  };
}

// const productos = new ProductManager();

// productos.addProduct("title1", "Description1", 100, "img1", "abc100", 10);
// productos.addProduct("title2", "Description2", 200, "img2", "abc101", 20);
// productos.addProduct("title3", "Description3", 300, "img3", "abc102", 30);
// productos.addProduct("title4", "Description4", 100, "img4", "abc103", 10);
// productos.addProduct("title5", "Description5", 200, "img5", "abc104", 20);
// productos.addProduct("title6", "Description6", 300, "img6", "abc105", 30);
// productos.addProduct("title7", "Description7", 100, "img7", "abc106", 10);
// productos.addProduct("title8", "Description8", 200, "img8", "abc107", 20);
// productos.addProduct("title9", "Description9", 300, "img9", "abc108", 30);
// productos.addProduct("title10", "Description10", 300, "img10", "abc109", 30);

// productos.getProducts();

// productos.getProductsById(2);

// productos.deleteProductsById(2);

// productos.updateProducts({
//   title: "title3",
//   description: "Description3",
//   price: 350,
//   img: "img3",
//   code: "c123",
//   stock: 30,
//   id: 3,
// });
