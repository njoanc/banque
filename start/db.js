const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

let connection = config.get("db");

const db = mongoose.connect(connection, {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(() => winston.info('\x1b[34m%s\x1b[0m', `MongoDB is connected to ${connection}........`))

module.exports = db;












//@TODO return process.env.MONGODB_URI when done with tests