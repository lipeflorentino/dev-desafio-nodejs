const shortid = require('shortid');
const prisma = require('../../../../database/prisma/config/dbConfig');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

async function shortenUrl(req, res) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { originalUrl } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  let userId = null;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  try {
    // Verificar se o token JWT é válido e extrair o ID do usuário
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (error) {
        console.log('Erro durante autenticação de usuário!', { error })
        //return res.status(401).json({ error: 'Invalid token' });
      }
    }

    // Gerar um URL curto único
    const shortUrl = shortid.generate().slice(0, 6);

    // Armazenar o URL no banco de dados
    if (userId) {
        const newUrl = await prisma.url.create({
            data: {
              originalUrl,
              shortUrl,
              userId,
            },
        });

        console.log('Criado com sucesso!', { newUrl });
    }

    res.status(201).json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Listar URLs encurtadas pelo usuário
async function listUrls(req, res) {
    try {
      const urls = await prisma.url.findMany({
        where: { userId: req.user.userId, deletedAt: null },
        select: {
          id: true,
          originalUrl: true,
          shortUrl: true,
          clicks: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.status(200).json(urls);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Deletar URL encurtada (deleção lógica)
async function deleteUrl(req, res) {
    const { id } = req.query;
    try {
      const url = await prisma.url.updateMany({
        where: { id: Number(id), userId: req.user.userId, deletedAt: null },
        data: { deletedAt: new Date() },
      });
  
      if (url.count === 0) {
        return res.status(404).json({ error: 'URL not found or already deleted' });
      }
  
      res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Atualizar URL encurtada
async function updateUrl(req, res) {
    const { id } = req.query;
    const { newOriginalUrl } = req.body;

    try {
      const url = await prisma.url.update({
        where: { id: Number(id), userId: req.user.userId, deletedAt: null },
        data: { originalUrl: newOriginalUrl, updatedAt: new Date() },
      });
  
      if (url.count === 0) {
        return res.status(404).json({ error: 'URL not found or you do not have permission to update it' });
      }
  
      res.status(200).json({ message: 'URL updated successfully' });
    } catch (error) {
        console.log('Error', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
  shortenUrl,
  listUrls,
  deleteUrl,
  updateUrl,
};