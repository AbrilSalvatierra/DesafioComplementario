import express from 'express';
import Cart from '../dao/models/cartModel.js';
import Product from '../dao/models/productsModel.js';

const cartRouter = express.Router();

// Obtener todos los carritos
cartRouter.get('/', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products');
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un carrito por ID
cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products');
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un producto a un carrito
cartRouter.post('/', async (req, res) => {
    try {
        const newCart = new Cart(req.body);
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await Cart.findById(cartId);
        const product = await Product.findById(productId);

        if (!cart || !product) {
            res.status(404).json({ error: "Cart or Product not found" });
            return;
        }

        cart.products.push(product); // Corregido a cart.products
        await cart.save();
        res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto del carrito
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }

        cart.products = cart.products.filter(product => product.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar la cantidad
cartRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }

        // Find the product index in the cart
        const productIndex = cart.products.findIndex(product => product == productId);
        if (productIndex === -1) {
            res.status(404).json({ error: 'Product not found in cart' });
            return;
        }

        // Update product quantity
        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({ message: 'Product quantity updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar múltiples productos al carrito
cartRouter.put("/:cid/products", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productIds = req.body.productIds;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            res.status(404).json({ error: "Cart not found" });
            return;
        }

        // Agregar productos al carrito
        for (const productId of productIds) {
            const product = await Product.findById(productId);
            if (!product) {
                console.error(`Product with ID ${productId} not found`);
                continue;
            }
            cart.products.push(product);
        }

        await cart.save();
        res.status(200).json({ message: "Products added to cart successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default cartRouter;