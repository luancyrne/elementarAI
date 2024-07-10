const { MongoClient, ServerApiVersion } = require('mongodb');
const logger = require('../utils/logger');
require('dotenv').config();

class DATABASE {
  constructor() {
    this.host = process.env.MONGO_HOST;
    this.db = null;
    this.conn = null;
  }

  client() {
    return new MongoClient(this.host, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  async connection() {
    try {
      const connection = await this.client().connect();
      this.conn = connection;
      this.db = connection.db();
      logger.info('Connect sucess mongoDB');
    } catch (error) {
      throw new Error(`Error connect mongodb -> ${error}`);
    }
  }

  async getCollection(collectionName) {
    try {
      await this.connection();
      return this.db.collection(collectionName);
    } catch (error) {
      throw new Error(`getCollection fail -> ${error}`);
    }
  }
}

module.exports = DATABASE;
