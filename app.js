const { startServer } = require("./src/server.js");

startServer();
const express = require("express");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const passport = require("passport");
const cors = require("cors");
const { Server } = require("socket.io");
const compression = require("express-compression");
const initPassport = require("./src/passportJwt/passportJwt.js");
const { socketProducts } = require("./src/utils/socketProducts.js");
const { initPassportGithub } = require("./src/config/passportConfig.js");

const { errorHandling } = require("./src/middleware/errorHandling.js");
const { addLogger, logger } = require("./src/utils/logger.js");
const app = express();
require("dotenv");

const viewRouter = require("./src/router/viewsRouter.js");
const userRouter = require("./src/router/userRouter.js");
const sessionRouter = require("./src/router/sessionRouter.js");
const productsRouter = require("./src/router/productsRouter.js");
const cartRouter = require("./src/router/cartRouter.js");
const ticketRouter = require("./src/router/ticketRouter.js");
const mockingRouter = require("./src/router/mockingRouter.js");
const myProfileRouter = require("./src/router/myProfileRouter.js");

// config de app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static(__dirname + "/public"));
app.use(cors());
router.use(
  compression({
    brotli: {
      enabled: true,
      zlib: {},
    },
  })
);

//configuracion de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// middleware
app.use(cookieParser("p@l@Br@s3cr3t0"));
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: process.env.MONGO_KEY_SECRET,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 60 * 1000,
    }),
    secret: "s3cr3t0c0d3",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(addLogger);

//passport
initPassport();
initPassportGithub();
passport.use(passport.initialize());
passport.use(passport.session());

//rutas
app.use("/", viewRouter);
app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/tickets", ticketRouter);
app.use("/mocking", mockingRouter);
app.use("/myProfile", myProfileRouter);
app.use(errorHandling);

const PORT = process.env.PORT;
const httpServer = app.listen(PORT, () => {
  logger.info(`Running in the port: ${PORT}`);
});

const socketServer = new Server(httpServer);
socketProducts(socketServer);
