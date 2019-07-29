require('express-async-errors');
const winston = require('winston');

module.exports = () => {
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'appUncaught.json' }))
    process.on('unhandledRejection', (ex) => {
        throw (ex);
    })
    process.on('DeprecationWarning', (ex) => {
        throw (ex);
    })


}