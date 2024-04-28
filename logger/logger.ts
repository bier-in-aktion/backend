import Logger from 'winston';
/// //////////////////////////////////
// Logger configuration
/// //////////////////////////////////

let loggerConsoleTransport: Logger.transports.ConsoleTransportInstance = new Logger.transports.Console(
    {
        // level: 'info',
        format: Logger.format.combine(
            Logger.format.colorize(),
            Logger.format.simple()
        ),
    }
);

let logFormat = Logger.format.printf(({ level, message, label, timestamp, meta }) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${timestamp};${level};${message};${meta ? JSON.stringify(meta) : ''}`;
});


let loggerConfig: Logger.LoggerOptions = {
    exceptionHandlers: [loggerConsoleTransport],
    transports: [loggerConsoleTransport],
};

Logger.configure(loggerConfig);

Logger.log({ level: 'info', message: 'Logger up and running!' });

export default Logger;
