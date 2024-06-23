import path from 'path';
import winston from 'winston';
import "winston-daily-rotate-file";

// const logDirectory = path.join(__dirname, 'logs');

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    debug: 'white',
}

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors)

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.splat(),
    winston.format.printf(info => `${info.timestamp} [${info.level}] : ${info.message}`)
)

var logger = winston.createLogger({
    level: level(),
    levels: levels,
    format: format,
    transports: [
        new winston.transports.DailyRotateFile({
            filename: 'logs/all-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '30d'
        }),
        new winston.transports.DailyRotateFile({
            level: 'error', // error only
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '20m',
            maxFiles: '30d'
        })
    ],
    exitOnError: false,
});

// Don't show console logs in production
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.splat(),
            winston.format.printf(info => `${info.timestamp} [${info.level}] : ${info.message}`),
        )
    }));
}

logger.stream = {
    write: function (message) {
        logger.http(message);
    }
}

export {
    logger
}
