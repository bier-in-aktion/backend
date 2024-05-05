import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import CONFIG from './config/config.loader';
import Logger from './logger/logger';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import { BINDINGS } from './inversify/inversify.config';
import { Consumer } from './kafka/consumer';

let httpServer: http.Server;

(async () => {
    try {
        const container: Container = new Container();
        await container.loadAsync(BINDINGS);

        const server: InversifyExpressServer = new InversifyExpressServer(container);
        // const useSSL: boolean = (CONFIG.WEB.NODE_ENV !== 'development');
        // const trustProxy: boolean = (CONFIG.WEB.PROXY == true);

        // const { store, maxAge } = getSessionStore();

        server.setConfig(app => {
            // app.use(session({
            //     store,
            //     secret: 'yq8qom1h7',
            //     proxy: trustProxy,
            //     cookie: {
            //         secure: useSSL,
            //         httpOnly: useSSL,
            //         maxAge,
            //     },
            //     resave: true,
            //     saveUninitialized: false,
            // }));
            app.use(helmet());
            app.use(express.urlencoded({ limit: '20mb', extended: true }));
            app.use(express.json({ limit: '20mb' }));
            app.use(helmet({
                contentSecurityPolicy: {
                    useDefaults: true,
                    directives: {
                        'script-src': ['\'self\'', '\'unsafe-inline\''],
                        'script-src-attr': ['\'self\'', '\'unsafe-inline\''],
                        'style-src': ['\'self\'', '\'unsafe-inline\''],
                    },
                },
            }));
        });

        // handle exceptions, applied after registering all app middleware and controller routes
        server.setErrorConfig(app => {
            app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
                Logger.error('' + (error.stack || error));
                if (!res.headersSent)
                    res.json({ data: null, error: 'ERROR_UNKNOWN' });
            });
        });

        const expressApplication: express.Application = server.build();

        httpServer = http.createServer(expressApplication);
        httpServer.on('error', error => {
            onError(error);
        });
        httpServer.on('listening', () => {
            onListening(httpServer);
        });
        httpServer.listen(CONFIG.WEB.PORT);

        const consumer = container.resolve(Consumer);
        consumer.start();
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const e: string = '' + ((error as Error).stack || error);
        writeStartupErrorLog(e);
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
    }
})();

/**
 * Event handler for HTTP server 'error' event
 */
function onError(error: any): void {
    let e: string;
    if (error.syscall !== 'listen') {
        e = '' + (error.stack || error);
        writeStartupErrorLog(e);
        Logger.error(e);
        process.exit(1);
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        e = `Port ${CONFIG.WEB.PORT} requires elevated privileges`;
        writeStartupErrorLog(e);
        Logger.error(e);
        process.exit(1);
        break;
    case 'EADDRINUSE':
        e = `Port ${CONFIG.WEB.PORT} is already in use`;
        writeStartupErrorLog(e);
        Logger.error(e);
        process.exit(1);
        break;
    default:
        e = error.trace || error;
        writeStartupErrorLog(e);
        Logger.error(e);
        process.exit(1);
    }
}

/**
 * Event handler for HTTP server 'listening' event.
 */
function onListening(server: any): void {
    const addr: any = server.address();

    Logger.info('#####################################################################');
    Logger.info(`## ProgressiveWebApp ${CONFIG.WEB.NODE_ENV} server running on ${addr.family} ${addr.address} ${CONFIG.WEB.PORT}`);
    Logger.info('#####################################################################');
}

function writeStartupErrorLog(text: string): void {
    let now: string = new Date().toISOString();
}
