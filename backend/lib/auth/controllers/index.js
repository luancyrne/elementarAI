const jwt = require('jsonwebtoken');
const { getUser } = require('../repository');
require('dotenv').config();

const secret = process.env.SECRET_TOKEN_JWT;

const createAuthToken = async (req, res) => {
  try {
    const user = await getUser(req.body);
    if (user) {
      const token = jwt.sign({ username: user.name, email: user.email }, secret);
      return res.status(200).send({ token });
    }
    return res.status(404).send({ message: 'Usuário ou senha incorreto', error: 'Error authenticate' });
  } catch (err) {
    return res.status(500).send({ message: 'Falhaa ao buscar usuário', error: err });
  }
};

module.exports = {
  createAuthToken,
};
