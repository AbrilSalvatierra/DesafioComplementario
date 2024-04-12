// authRouter.js
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../dao/models/userModel.js';

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send('Usuario registrado exitosamente');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

authRouter.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).send('Contraseña incorrecta');
      }
  
      // Asignar el rol según credenciales
      if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        user.role = 'admin';
      }
  
      req.session.user = user;

      // Redireccion según el rol
      if (user.role === 'admin') {
        res.redirect('/admin/products');
      } else {
        res.redirect('/products');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

  

export default authRouter;
