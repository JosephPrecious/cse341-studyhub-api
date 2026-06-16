const mongodb = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const MongoClient = mongodb.MongoClient;

let database;

const initDb = (callback) => {
  if (database) {
    return callback(null, database);
  }

  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      database = client.db("studyhubAPI");
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

module.exports = {
  initDb,
  getDb
};