const cors = require('cors');
const elementControllers = require('./controllers/getElement');
require('dotenv').config();

module.exports = (router) => {
  router.use(cors({ origin: process.env.CORS }));
  router.post('/elements', elementControllers.getElement);
};
