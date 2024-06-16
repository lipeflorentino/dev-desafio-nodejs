const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { shortenUrl, listUrls, deleteUrl, updateUrl, redirectUrl } = require('../src/controllers/urlController');
const prismock = require('../config/dbConfig');

const app = express();
app.use(express.json());
app.post('/shorten', shortenUrl);
app.get('/url/list', authenticateToken, listUrls);
app.delete('/url/delete', authenticateToken, deleteUrl);
app.put('/url/update', authenticateToken, updateUrl);
app.get('/:shortUrl', redirectUrl);

// Middleware de autenticação para os testes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

jest.mock('@prisma/client', () => {
    return {
        ...jest.requireActual('@prisma/client'),
        PrismaClient: jest.requireActual('prismock').PrismockClient,
    };
});

describe('URL Controller', () => {
    describe('shortenUrl', () => {
        it('should shorten a URL for an unauthenticated user', async () => {
            const urlData = { originalUrl: 'https://example.com' };

            const response = await request(app).post('/shorten').send(urlData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('shortUrl');
        });

        it('should shorten a URL for an authenticated user', async () => {
            const urlData = { originalUrl: 'https://example.com' };
            const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const response = await request(app)
            .post('/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send(urlData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('shortUrl');

            const createdUrl = await prismock.url.findUnique({ where: { originalUrl: urlData.originalUrl } });
            expect(createdUrl).toBeTruthy();
            expect(createdUrl.userId).toBe('123');
        });
    });

    describe('listUrls', () => {
        it('should list URLs for an authenticated user', async () => {
            const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET, { expiresIn: '1h' });

            await prismock.url.create({
                data: {
                    originalUrl: 'https://example.com',
                    shortUrl: 'abc123',
                    userId: '123',
                    clickCount: 0,
                },
            });

            const response = await request(app)
                .get('/url/list')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('clickCount', 0);
        });
    });

    describe('deleteUrl', () => {
        it('should delete a URL for an authenticated user', async () => {
            const token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const url = await prismock.url.create({
                data: {
                    originalUrl: 'https://example.com',
                    shortUrl: 'abc123',
                    userId: 123,
                },
            });

            const response = await request(app)
                .delete(`/url/delete?id=${url.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);

            const deletedUrl = await prismock.url.findUnique({ where: { id: url.id, userId: url.userId } });
            expect(deletedUrl.deletedAt).not.toBeNull();
        });
    });

    describe('updateUrl', () => {
        it('should update the original URL for an authenticated user', async () => {
            const token = jwt.sign({ userId: 234 }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const url = await prismock.url.create({
            data: {
                originalUrl: 'https://example.com',
                shortUrl: 'abc123',
                userId: 234,
            },
            });

            const newUrlData = { newOriginalUrl: 'https://newexample.com' };

            const response = await request(app)
                .put(`/url/update?id=${url.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(newUrlData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'URL updated successfully');

            const updatedUrl = await prismock.url.findUnique({ where: { id: url.id, userId: url.userId } });
            expect(updatedUrl.originalUrl).toBe('https://newexample.com');
        });
    });

    describe('redirectUrl', () => {
        it('should redirect to the original URL and increment click count', async () => {
            await prismock.url.create({
                data: {
                    originalUrl: 'https://example.com',
                    shortUrl: 'abc123',
                    clickCount: 0,
                },
            });

            const response = await request(app).get(`/abc123`);

            expect(response.status).toBe(302);
            expect(response.header.location).toBe('https://example.com');

            const updatedUrl = await prismock.url.findUnique({ where: { shortUrl: 'abc123' } });
            expect(updatedUrl.clickCount).toBe(1);
        });
    });
});
