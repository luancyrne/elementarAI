const DATABASE = require('../../database');

const db = new DATABASE();
const collectionName = 'users';

const insertOne = async (data) => {
  const collection = await db.getCollection(collectionName);
  await collection.insertOne(data);
  db.conn.close();
};

const getUser = async (data) => {
  const collection = await db.getCollection(collectionName);
  const result = await collection.findOne(data);
  db.conn.close();
  return result;
};

module.exports = {
  insertOne,
  getUser,
};
