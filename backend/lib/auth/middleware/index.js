const jwt = require('jsonwebtoken');
const { getUser } = require('../repository');
require('dotenv').config();

const secret = process.env.SECRET_TOKEN_JWT;

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (header) {
    const formattedHeader = header.split(' ');
    const typeHeader = formattedHeader[0];

    if (typeHeader === 'Bearer') {
      const token = formattedHeader[1];
      const decodedJwt = jwt.decode(token, secret);
      if (!decodedJwt) return res.status(404).send({ message: 'Invalid token' });
      const user = getUser({ name: decodedJwt.name });
      return user ? next() : res.status(404).send({ message: 'User or password invalid' });
    }

    return res.status(404).send({ message: 'Invalid authorization method', error: typeHeader });
  }

  return res.status(404).send({ message: 'Required token' });
};
