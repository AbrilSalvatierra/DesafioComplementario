import express from 'express';
import Product from '../dao/models/productsModel.js';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsRouter = express.Router();

Product.paginate = mongoosePaginate;

productsRouter.get('/', async (req, res) => {
    try {
        const { 
            limit = 10, 
            page = 1, 
            sort = 'createdAt', 
            query = {} 
        } = req.query;
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        if (page > totalPages) {
            res.status(404).json({ error: 'Página no encontrada' });
            return;
        }

        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const response = {
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: parseInt(page)
            }
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto por ID
productsRouter.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
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
        const newProduct = new Product(req.body);
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
        await Product.findByIdAndUpdate(productId, req.body);
        res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Eliminar un producto
productsRouter.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.sendStatus(204);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default productsRouter;
