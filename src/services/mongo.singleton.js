import mongoose from "mongoose";
import config from "../config.js";

export default class MongoSingleton {
  static #instance;

  constructor() {
    this.connect();
  }

  async connect() {
    await mongoose.connect(config.MONGODB_URI);
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoSingleton();
      console.log(
        `Conexión 1234 Creada. Servidor Express activo en el puerto ${config.PORT}, con conexion a Mongoose: ${config.MONGODB_URI}.`
      );
    } else {
      console.log(
        `Conexión 1234 Recuperada. Servidor Express activo en el puerto ${config.PORT}, con conexion a Mongoose: ${config.MONGODB_URI}.`
      );
    }

    return this.#instance;
  }
}
