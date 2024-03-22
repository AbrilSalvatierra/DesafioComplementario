import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import productsRouter from "./router/productsRouter.js";
import cartRouter from "./router/cartRouter.js";
import mongoose from "mongoose";

const app = express();
const httpServer = http.createServer(app);

mongoose
  .connect('mongodb+srv://salvatierraabril:MemcPIWnJbqZY8Pi@ecommerce.jy4qvo4.mongodb.net/')
  .then(() => console.log("Conexión a MongoDB Atlas exitosa"))
  .catch((err) => console.error("Error al conectar a MongoDB Atlas:", err));

app.set("views", `${__dirname}/views`);

//Motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});


//Socket.io
export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat message", async (msg) => {
    try {
      const newMessage = new Message({
        user: "correoDelUsuario",
        message: msg,
      });
      await newMessage.save();
      io.emit("chat message", msg);
    } catch (error) {
      console.error("Error al guardar el mensaje en MongoDB:", error);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log("Servidor conectado!!");
});
