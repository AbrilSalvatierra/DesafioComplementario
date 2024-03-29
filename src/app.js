import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import router from "./routes.js";
import __dirname from "./utils.js";
import Product from "./dao/models/productsModel.js";

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
app.use(express.json());

mongoose
  .connect('mongodb+srv://salvatierraabril:MemcPIWnJbqZY8Pi@ecommerce.jy4qvo4.mongodb.net/')
  .then(() => console.log("Conexión a MongoDB Atlas exitosa"))
  .catch((err) => console.error("Error al conectar a MongoDB Atlas:", err));


app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use("/api/", router);

app.get("/", async(req, res) => {
  res.render("home");
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find(); 
    //console.log(products); 
    res.render("realTimeProducts", { products: products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

// Socket.io
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
