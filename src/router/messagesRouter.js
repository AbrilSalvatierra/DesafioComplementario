import express from 'express';
import Message from '../dao/models/messageModel.js';

const messagesRouter = express.Router();

// Obtener todos los mensajes
messagesRouter.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un nuevo mensaje
messagesRouter.post('/', async (req, res) => {
    try {
        const { user, text } = req.body;
        const newMessage = new Message({ user, text });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default messagesRouter;