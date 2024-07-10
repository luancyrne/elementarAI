const OPENAI = require('../../services/openai');
const logger = require('../../utils/logger');

const openai = new OPENAI();

const getElement = async (req, res) => {
  try {
    const response = await openai.generateText(req.body);

    res.status(200).send(response.result);
  } catch (err) {
    logger.error(`Fail generate element -> ${err}`);
    res.status(404).send({ message: 'Fail generate element', error: err.message });
  }
};

module.exports = {
  getElement,
};
