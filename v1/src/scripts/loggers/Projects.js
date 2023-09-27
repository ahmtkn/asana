const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service: 'projects-service' },
    transports: [
        new winston.transports.File({ filename: 'v1/src/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'v1/src/logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: 'v1/src/logs/combined.log'}),
    ],
});

module.exports = logger