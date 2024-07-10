const authControllers = require('./controllers');

module.exports = (router) => {
  router.post('/auth', authControllers.createAuthToken);
};
