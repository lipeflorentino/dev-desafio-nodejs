const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/dbConfig');
require('dotenv').config();

const { validationResult } = require('express-validator');

// Função para registrar um novo usuário
async function register(req, res) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password } = req.body;

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Função para autenticar um usuário
async function login(req, res) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  console.log('Trying to log in...', { email });

  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Comparar senha
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Auth generated', { token: `Bearer ${token}` });

    res.status(200).json({ token: `Bearer ${token}` });
  } catch (error) {
    console.log('Server error', { error });
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  register,
  login,
};
