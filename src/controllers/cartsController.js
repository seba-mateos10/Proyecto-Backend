const {
  cartService,
  productService,
  ticketService,
} = require("../service/services.js");
const { v4: uuidv4 } = require("uuid");
const transport = require("../utils/nodeMailer.js");
const objectConfig = require("../config/objectConfig.js");
const { logger } = require("../utils/logger.js");

class CartController {
  getCarts = async (req, res) => {
    try {
      const carts = await cartService.getCarts();

      res.status(200).send({
        status: "success",
        payload: carts,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  getCart = async (req, res) => {
    try {
      let { cid } = req.params;
      let cart = await cartService.getCartByID(cid);

      if (!cart)
        return res.send({ status: "Error", message: "Cart not found" });

      const cartObj = {
        title: "Cart",
        style: "cart.css",
        id: cart._id,
        products: cart.products,
      };

      res.render("cartById", cartObj);
    } catch (error) {
      logger.error(error);
    }
  };

  createCart = async (req, res) => {
    try {
      const result = await cartService.createCart();

      result
        ? res.status(200).send({
            status: "The cart was created successfully",
            payload: result,
          })
        : res
            .status(404)
            .send({ status: "Error", message: "There's been a problem" });
    } catch (error) {
      logger.error(error);
    }
  };

  addProduct = async (req, res) => {
    try {
      let { cid, pid } = req.params;
      const cart = await cartService.getCartByID(cid);
      const product = await productService.getProduct({ _id: pid });

      if (product.owener === req.user.email)
        return res.status(404).send({
          status: "Error",
          message: "You can't add your products to your cart",
        });

      if (!product)
        return res.status(404).send({
          status: "Error",
          message: "The product does not exist",
        });

      if (!cart)
        return res.status(404).send({
          status: "Error",
          message: "The cart does not exist",
        });

      if (product.stock < 1)
        return res.status(404).send({
          status: "Error",
          message: "The product does not have enough stock",
        });

      if (cart && product) {
        await cartService.addProductAndUpdate(cid, pid);

        res.status(200).send({
          status: "The cart was updated successfully",
          message: `the product ${product.title} was added to the cart`,
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };

  deleteProductInCart = async (req, res) => {
    try {
      let { cid, pid } = req.params;
      let cart = await cartService.deleteProduct(cid, pid);

      if (!cart) {
        res.status(404).send({
          status: "error",
          message: "Cart o product not found",
        });
      } else {
        res.status(200).send({
          status: "success",
          message: "the product is removed from the cart",
          payload: cart,
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };

  deleteProductsInCart = async (req, res) => {
    try {
      let { cid } = req.params;
      let cart = await cartService.deleteAllProd(cid);

      if (!cart)
        return res
          .status(404)
          .send({ status: "error", message: "Cart not found" });

      res.status(200).send({
        status: "success",
        message: "The cart was emptied successfully",
        payload: cart,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  cartPurchase = async (req, res) => {
    try {
      const { cid } = req.params;
      console.log("Received cart ID:", cid); // Log para el ID del carrito

      const cart = await cartService.getCartByID(cid);
      console.log("Cart retrieved:", cart); // Log para mostrar el carrito

      const insufficientStock = [];
      const buyProducts = [];

      if (!cart) {
        console.log("Cart not found, returning 404"); // Log si no se encuentra el carrito
        return res
          .status(404)
          .send({ status: "Error", message: "Cart not found" });
      }

      // Cambiar el forEach a un bucle for para usar await correctamente
      for (const item of cart.products) {
        const product = item.product;
        const quantity = item.quantity;
        const stock = product.stock; // Asegúrate de que `stock` se esté obteniendo correctamente
        console.log(
          `Processing product: ${product.title}, Quantity: ${quantity}, Stock: ${stock}`
        ); // Log para cada producto

        if (quantity > stock) {
          insufficientStock.push(product);
          console.log(`Insufficient stock for product: ${product.title}`); // Log si hay stock insuficiente
        } else {
          buyProducts.push({ product, quantity });
          console.log(`Adding product to buy list: ${product.title}`); // Log para agregar productos a la lista de compra

          // Actualizar el stock y eliminar el producto del carrito
          await productService.updateProduct(product, {
            stock: stock - quantity,
          });
          await cartService.deleteProduct(cart, product);
          console.log(
            `Updated stock for product: ${product.title}. New stock: ${
              stock - quantity
            }`
          ); // Log para el stock actualizado
        }
      }

      const totalAmount = buyProducts.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      const totalPrice = buyProducts
        .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
        .toFixed(3);

      console.log("Total amount of products purchased:", totalAmount); // Log del total de productos
      console.log("Total price of purchase:", totalPrice); // Log del precio total

      if (!buyProducts.length) {
        console.log("No products to buy, returning 404 for insufficient stock"); // Log si no hay productos para comprar
        return res.status(404).send({
          status: "Error",
          message: "Insufficient stock in the products",
          products: insufficientStock.map((prod) => prod.title),
        });
      }

      if (buyProducts.length > 0) {
        const ticket = await ticketService.createTicket({
          code: uuidv4(),
          amount: totalAmount,
          purchaser: req.user.email,
        });

        console.log("Ticket created:", ticket); // Log para el ticket creado

        return res.send({
          status: "Success",
          message: "Successful purchase",
          toTicket: ticket,
        });
      }
    } catch (error) {
      logger.error("Error in cart purchase:", error); // Log para errores
      return res
        .status(500)
        .send({ status: "Error", message: "Internal server error" });
    }
  };
}

module.exports = CartController;
