import express from 'express';
import Products from '../dao/models/productsModel.js';

const productsRouter = express.Router();

// Obtener todos los productos
productsRouter.get('/', async (req, res) => {
    try {
        const products = await Products.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto por su ID
productsRouter.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Products.findById(productId);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
    try {
        const newProduct = new Products(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto existente
productsRouter.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await Products.findByIdAndUpdate(productId, req.body);
        res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Eliminar un producto
productsRouter.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await Products.findByIdAndDelete(productId);
        res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


export default productsRouter;