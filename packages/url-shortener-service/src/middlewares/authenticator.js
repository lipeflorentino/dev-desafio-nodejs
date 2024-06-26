const jwt = require('jsonwebtoken');

// Middleware para autenticação
function authenticateToken(req, res, next) {
  console.log('Autenticando o token');
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    console.log('Verificado com sucesso!');
    next();
  });
}

module.exports = {
    authenticateToken,
}