const mongodb = require("mongodb");
const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const MongoClient = mongodb.MongoClient;

let database;

const initDb = (callback) => {
  if (database) {
    return callback(null, database);
  }

  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client.db("studyhubDB");
      console.log("MongoDB Connected");
      callback(null, database);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
};

const getDb = () => {
  return database;
};

const setDb = (db) => {
  database = db;
};

module.exports = {
  initDb,
  getDb,
  setDb
};
