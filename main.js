class ProductManager {
  constructor() {
    this.products = [];
  }

  static id = 0;

  addProduct(title, description, price, img, code, stock) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].code === code) {
        console.log(`El codigo ${code} se repite`);
        break;
      }
    }

    const newProduct = {
      title,
      description,
      price,
      img,
      code,
      stock,
    };

    if (!Object.values(newProduct).includes(undefined)) {
      ProductManager.id++;
      this.products.push({ ...newProduct, id: ProductManager.id });
    } else {
      console.log("Todos los campos son obligatorios");
    }
  }

  getProducts() {
    return this.products;
  }

  existe(id) {
    return this.products.find((product) => product.id === id);
  }

  getProductsById(id) {
    !this.existe(id) ? console.log("Not Found") : console.log(this.existe(id));
  }
}

const Products = new ProductManager();

//
//
//

//Primer llamada con arreglo vacio
console.log(Products.getProducts());

//Agregando los productos
Products.addProduct(
  "CAROLINA HERRERA 212 VIP MEN",
  "Una fragancia de personalidad,tanto explosiva como magnética. Una pulsación fragante que combina estilo y actitud.",
  9000,
  "img1",
  "a123",
  10
);

Products.addProduct(
  "DIOR HOMME SPORT",
  "Un frescorque se enfrenta al desafío y una permanecia extrema, de un principio que dura y no termina.",
  8000,
  "img2",
  "a1234",
  10
);

//Segunda llamada con arreglo con producto
console.log(Products.getProducts());

//Validacion de codigo repetido
Products.addProduct(
  "VERSACE BLUE JEANS",
  "Unafrescurasorprendente, inmediata y limpia.",
  7000,
  "img3",
  "a1234",
  10
);

//Busqueda de producto por id
Products.getProductsById(1);

//Busqueda por id NO encontrado
Products.getProductsById(4);
