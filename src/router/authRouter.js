import express from 'express';
//import bcrypt from 'bcrypt';
import User from '../dao/models/userModel.js';

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    //const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
    await newUser.save();
    res.status(201).send('Usuario registrado correctamente');
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
    //const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send('Contraseña incorrecta');
    }

    // Asignar el rol según las credenciales
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      user.role = 'admin';
    }

    req.session.user = user;

    // Redireccionar según el rol
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
