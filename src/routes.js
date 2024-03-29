import express from 'express';
import productsRouter from './router/productsRouter.js';
import cartRouter from './router/cartRouter.js';
import messagesRouter from './router/messagesRouter.js';
const router = express.Router();

//Rutas
router.use('/products', productsRouter);
router.use('/carts', cartRouter);
router.use('/messages', messagesRouter);

export default router;