const winston = require('winston');
const mongoose = require('mongoose');
require('dotenv').config() 


module.exports = function() {
  const db = process.env.DATABASE_STRING;
  mongoose.connect(db, {
    useNewUrlParser: true
  })
    .then(() => winston.info(`Connected to ${db}...`));
}