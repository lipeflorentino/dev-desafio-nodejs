const express = require('express');
const { shortenUrl, listUrls, deleteUrl, updateUrl, redirectUrl } = require('../controllers/urlController');
const { authenticateToken } = require('../middlewares/authenticator');
const { validateRequest } = require('../middlewares/validator');

const router = express.Router();

// Rota para encurtar URL
router.post('/shorten', [validateRequest], shortenUrl);

// Rotas que requerem autenticação
router.get('/list', [authenticateToken, validateRequest], listUrls);
router.delete('/delete', [authenticateToken, validateRequest], deleteUrl);
router.patch('/update', [authenticateToken, validateRequest], updateUrl);
// Rota para redirecionamento e contagem de cliques
router.get('/:shortUrl', [validateRequest], redirectUrl);

module.exports = router;