import express from 'express';
import Cart from '../dao/models/cartModel.js';

const cartRouter = express.Router();

// Obtener todos los carritos
cartRouter.get('/', async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un carrito por su ID
cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un producto a un carrito
cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        // Aquí deberías agregar lógica para agregar el producto al carrito

        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default cartRouter;