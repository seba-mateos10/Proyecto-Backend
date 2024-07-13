import express from "express";
import "dotenv/config";

//routes
import { authRouter, productsRouter, cartsRouter } from "./routes/index.js";

import __dirname from "./utlis.js";
import { dbConnection } from "./database/config.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//endpoints
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//inicializamos la basde de datos
await dbConnection();

app.listen(PORT, () => {
  console.log(`Corriendo aplicacion en el puerto ${PORT}`);
});
