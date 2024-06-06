import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import "dotenv/config";

import products from "./routes/products.router.js";
import carts from "./routes/carts.router.js";
import views from "./routes/views.js";
import __dirname from "./utlis.js";
import { dbConnection } from "./database/config.js";
import { messageModel } from "./models/messages.js";
import { addProductService, getProductsService } from "./services/products.js";
import { initializaPassport } from "./config/passport.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `${process.env.URI_MONGO_DB}/${process.env.NAME_DB}`,
      ttl: 3600,
    }),
    secret: process.env.SECRET_SESSION,
    saveUninitialized: true,
    resave: false,
  })
);

// CONFIG PASSPORT
initializaPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", views);
app.use("/api/products", products);
app.use("/api/carts", carts);

await dbConnection();

const expressServer = app.listen(PORT, () => {
  console.log(`Corriendo aplicacion en el puerto ${PORT}`);
});
const io = new Server(expressServer);

io.on("connection", async (socket) => {
  // Products
  const limit = 50;
  const { payload } = await getProductsService({ limit });
  const productos = payload;
  socket.emit("productos", payload);

  socket.on("agregarProducto", async (producto) => {
    const newProduct = await addProductService({ ...producto });
    if (newProduct) {
      productos.push(newProduct);
      socket.emit("productos", productos);
    }
  });

  // Chat messages
  const messages = await messageModel.find();
  socket.emit("message", messages);

  socket.on("message", async (data) => {
    const newMessage = await messageModel.create({ ...data });
    if (newMessage) {
      const messages = await messageModel.find();
      io.emit("messageLogs", messages);
    }
  });

  socket.broadcast.emit("nuevo_user");
});
