/** Database for lunchly */

const pg = require("pg");


const {Client} = require("pg");


let DB_URI = {
    host: "localhost",
    user: "dnnyhua",
    password: "1123",
    database: ""
  }
  
DB_URI.database = (process.env.NODE_ENV === "test") ? "lunchly_test": "lunchly";

let db = new Client(DB_URI);

db.connect();

module.exports = db;