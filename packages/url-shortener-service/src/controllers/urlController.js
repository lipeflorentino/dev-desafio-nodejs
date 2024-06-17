const shortid = require('shortid');
const prisma = require('../../config/dbConfig');
const jwt = require('jsonwebtoken');

async function shortenUrl(req, res) {
    const { originalUrl } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    let userId = null;
    console.log('Input recebido!', { originalUrl, hasToken: token });

    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    try {
        // Verificar se o token JWT é válido e extrair o ID do usuário
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
                console.log('Usuário verificado com sucesso!', { decoded });
            } catch (error) {
                console.log('Erro durante autenticação de usuário!', { error });
                //return res.status(401).json({ error: 'Invalid token' });
            }
        }

        // Gerar um URL curto único
        const shortUrl = shortid.generate().slice(0, 6);

        console.log('Url encurtada foi gerada!!', { shortUrl });

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
    console.log('Recebido com sucesso!', { user: req.user });
    try {
        const urls = await prisma.url.findMany({
            where: { userId: req.user.userId, deletedAt: null },
            select: {
                id: true,
                originalUrl: true,
                shortUrl: true,
                clickCount: true,
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
    console.log('Recebido com sucesso!', { user: req.user, params: req.params });
    const { id } = req.params;

    try {
        const url = await prisma.url.updateMany({
            where: { id: Number(id), userId: req.user.userId, deletedAt: null },
            data: { deletedAt: new Date() },
        });
  
        if (url.count === 0) {
            return res.status(404).json({ error: 'URL not found or already deleted' });
        }
  
        res.status(204).json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.log('error', { error });
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Atualizar URL encurtada
async function updateUrl(req, res) {
    console.log('Recebido com sucesso!', { user: req.user, query: req.query, body: req.body, params: req.params });
    const { id } = req.params;
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

// Redirecionar para o URL original e contabilizar o acesso
async function redirectUrl(req, res) {
    console.log('Recebido com sucesso!', { user: req.user, params: req.params });
    const { shortUrl } = req.params;

    try {
        // Procurar o URL original no banco de dados
        const url = await prisma.url.findUnique({
            where: { shortUrl, deletedAt: null },
        });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Incrementar o contador de cliques
        await prisma.url.update({
            where: { shortUrl },
            data: { clickCount: { increment: 1 } },
        });

        console.log('Redirecionando...');

        // Redirecionar para o URL original
        res.redirect(url.originalUrl);
    } catch (error) {
        console.log('error', { error });
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
  shortenUrl,
  listUrls,
  deleteUrl,
  updateUrl,
  redirectUrl,
};