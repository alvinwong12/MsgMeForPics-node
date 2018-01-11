var winston = require('winston');
const stripAnsi = require('strip-ansi');
const moment = require('moment')
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: `./logs/m${new Date().getFullYear()}y${new Date().getMonth() + 1}d${new Date().getDate()}.log`,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss.SSSS');;
            }
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: function () {
                return moment().format('YYYY-MM-DD HH:mm:ss.SSSS');;
            }
        })
    ],
    exitOnError: false
});

module.exports = logger;

module.exports.stream = {
    write: function(message){
        logger.info(stripAnsi(message));
    }
};

