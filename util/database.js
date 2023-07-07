const mongodb = require("mongodb");
const mongoose = require("mongoose");

const MongoClient = mongodb.MongoClient;

let _db;
let mongoose_connect;

const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://inventoryApp:2WgofgBZ2dp1HzZU@cluster0.cwkrobe.mongodb.net/?retryWrites=true&w=majority`
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db("inventory-app");
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  console.log("No database found!");
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
