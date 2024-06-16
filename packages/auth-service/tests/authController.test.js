const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { register, login } = require('../src/controllers/authController');

jest.mock('@prisma/client', () => {
    return {
      ...jest.requireActual('@prisma/client'),
      PrismaClient: jest.requireActual('prismock').PrismockClient,
    };
  });

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);

describe('Auth Controller', () => {
  describe('registerUser', () => {
    it('should register a new user', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };

      const response = await request(app).post('/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should not register a user with an existing email', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };

      const response = await request(app).post('/register').send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email already in use');
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };

      const response = await request(app).post('/login').send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should not login with incorrect email', async () => {
      const userData = { email: 'wrong@example.com', password: 'password123' };

      const response = await request(app).post('/login').send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });

    it('should not login with incorrect password', async () => {
      const userData = { email: 'test@example.com', password: 'wrongpassword' };

      const response = await request(app).post('/login').send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });
  });
});
