const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

   if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Токен не найден' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch(err) {
    return res.status(401).json({ message: 'Ошибка авторизации' });
  }

  req.user = payload;

  next()
};
