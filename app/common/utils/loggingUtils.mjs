import winston from 'winston';
import "winston-daily-rotate-file";
import chalk from 'chalk';

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
    const env = process.env.NODE_ENV || 'local'
    const notProduction = env !== 'production'
    return notProduction ? 'debug' : 'warn'
}

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    http: 'magenta',
    debug: 'green',
}

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors)

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
    winston.format(info => ({ ...info, level: info.level.toUpperCase() }))(),
    winston.format.errors({ stack: true }),
    winston.format.simple(),
    winston.format.splat(),
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.printf(
        ({ timestamp, level, message }) => `${timestamp} [${level}] : ${message}`
    )
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

var cronLogger = winston.createLogger({
    level: level(),
    levels: levels,
    format: format,
    transports: [
        new winston.transports.DailyRotateFile({
            filename: 'logs/cron/%DATE%.log',
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
            format,
            winston.format.colorize(),
            winston.format.prettyPrint(),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format(info => ({ ...info, timestamp: chalk.gray(info.timestamp) }))(),
            winston.format.printf(
                ({ timestamp, level, message }) => `${timestamp} [${level}] : ${message}`
            )
        )
    }));

    cronLogger.add(new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
            format,
            winston.format.colorize(),
            winston.format.prettyPrint(),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format(info => ({ ...info, timestamp: chalk.gray(info.timestamp) }))(),
            winston.format.printf(
                ({ timestamp, level, message }) => `${timestamp} [${level}] : ${message}`
            )
        )
    }));
}

logger.stream = {
    write: function (message) {
        logger.http(message);
    }
}

// app log commands
const log = {
    error(message) {
        logger.error(message);
    },
    warn(message) {
        logger.warn(message);
    },
    info(message) {
        logger.info(message);
    },
    http(message) {
        logger.http(message);
    },
    debug(message) {
        logger.debug(message);
    }
}

// cron log commands
const cronLog = {
    error(message) {
        cronLogger.error(message);
    },
    warn(message) {
        cronLogger.warn(message);
    },
    info(message) {
        cronLogger.info(message);
    },
    http(message) {
        cronLogger.http(message);
    },
    debug(message) {
        cronLogger.debug(message);
    }
}

export {
    log,
    logger,
    cronLog
}
