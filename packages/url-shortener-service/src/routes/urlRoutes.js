const express = require('express');
const { shortenUrl, listUrls, deleteUrl, updateUrl, redirectUrl } = require('../controllers/urlController');
const { authenticateToken } = require('../middlewares/authenticator');

const router = express.Router();

// Rota para encurtar URL
router.post('/shorten', shortenUrl);

// Rotas que requerem autenticação
router.get('/list', authenticateToken, listUrls);
router.delete('/delete', authenticateToken, deleteUrl);
router.patch('/update', authenticateToken, updateUrl);
// Rota para redirecionamento e contagem de cliques
router.get('/:shortUrl', redirectUrl);

module.exports = router;