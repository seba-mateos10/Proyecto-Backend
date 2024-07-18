import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "./src/products.json";
  }

  async addProduct(prodAdd) {
    try {
      if (
        !prodAdd.title ||
        !prodAdd.description ||
        !prodAdd.price ||
        !prodAdd.code ||
        !prodAdd.stock ||
        !prodAdd.category
      ) {
        return 0;
      } else {
        const products = await this.getProductsFromFile();
        if (products.some((product) => product.code === prodAdd.code)) {
          return 1;
        } else {
          prodAdd.id =
            products.length > 0
              ? Math.max(...products.map((p) => p.id)) + 1
              : 1;
          prodAdd.status = true;
          if (prodAdd.thumbnail === undefined) {
            prodAdd.thumbnail = [];
          }
          products.push(prodAdd);
          await this.saveProductsToFile(products);
          return 2;
        }
      }
    } catch (error) {
      console.log("Error al agregar el producto.");
      console.log(error);
    }
  }

  async getProducts(limit) {
    try {
      if (!fs.existsSync(this.path)) {
        return;
      } else {
        const products = await this.getProductsFromFile();
        if (products.length === 0) {
          return; //console.log('El archivo esta vacio')
        } else {
          return limit === 0 ? products : products.slice(0, limit);
        }
      }
    } catch (error) {
      console.log("Error al mostrar los productos.");
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProductsFromFile();
      const prod = products.find((prod) => prod.id === +id) || {};
      if (prod === undefined) {
        console.log(`Producto con id ${id} no existe.`);
      } else {
        return prod;
      }
    } catch (error) {
      console.log("Error al buscar el producto por su id.");
      console.log(error);
    }
  }

  async updateProduct(id, prodU) {
    try {
      const products = await this.getProductsFromFile();
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products[index].title = prodU.title;
        products[index].description = prodU.description;
        products[index].price = prodU.price;
        products[index].thumbnail = prodU.thumbnail;
        products[index].code = prodU.code;
        products[index].stock = prodU.stock;
        products[index].status = prodU.status;
        products[index].category = prodU.category;
        await this.saveProductsToFile(products);
        return 0;
      } else {
        return 1;
      }
    } catch (error) {
      console.log("Error al intentar actualizar el producto por su id.");
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProductsFromFile();
      const prod = products.find((prod) => prod.id === id);
      if (prod === undefined) {
        return 0;
      } else {
        const productsFilter = products.filter((product) => product.id !== id);
        await this.saveProductsToFile(productsFilter);
        return 1;
      }
    } catch (error) {
      console.log("Error al intentar borrar el producto por su id.");
      console.log(error);
    }
  }

  async getProductsFromFile() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al intentar leer los productos del archivo.");
      console.log(error);
    }
  }

  async saveProductsToFile(products) {
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }
}

export default ProductManager;
