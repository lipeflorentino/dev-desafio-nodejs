const express = require('express');
const { shortenUrl, listUrls, deleteUrl, updateUrl } = require('../controllers/urlController');
const { authenticateToken } = require('../middlewares/authenticator');

const router = express.Router();
const { body } = require('express-validator');

// Rota para encurtar URL
router.post('/shorten', shortenUrl);

// Rotas que requerem autenticação
router.get('/list', authenticateToken, listUrls);
router.delete('/delete', authenticateToken, deleteUrl);
router.patch('/update', authenticateToken, updateUrl);

module.exports = router;