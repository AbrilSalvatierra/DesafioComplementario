import express from "express";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import __dirname from "./utils.js"
import mongoose from "mongoose";
import path from "path";
import router from "./routes.js";
import session from 'express-session';
import authRouter from './router/authRouter.js';

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");

// Conexión a MongoDB
mongoose
  .connect('mongodb+srv://salvatierraabril:MemcPIWnJbqZY8Pi@ecommerce.jy4qvo4.mongodb.net/')
  .then(() => console.log("Conexión a MongoDB Atlas exitosa"))
  .catch((err) => console.error("Error al conectar a MongoDB Atlas:", err));

// Configuración de sesiones
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false
}));

// Middleware para validar sesión
app.use((req, res, next) => {
  const allowedPaths = ['/auth/login', '/auth/register']; // Rutas permitidas sin sesión
  if (allowedPaths.includes(req.path) || req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
});

// Rutas
app.use('/auth', authRouter);
app.use('/', (req, res) => res.redirect('/auth/login'));

app.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
});

app.get("/", async(req, res) => {
  res.redirect('/auth/login');
});

app.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
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