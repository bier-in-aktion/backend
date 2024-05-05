import CONFIG from '../config/config.loader';
import Logger from '../logger/logger';

import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

const dataSourceOptions: any = {
    host: CONFIG.WEB.DATABASE_WEB_HOST,
    port: CONFIG.WEB.DATABASE_WEB_PORT,
    user: CONFIG.WEB.DATABASE_WEB_USERNAME,
    password: CONFIG.WEB.DATABASE_WEB_PASSWORD,
    database: CONFIG.WEB.DATABASE_WEB_NAME,
};

export let db: NodePgDatabase;

export async function initializeDataSource(): Promise<void> {
    try {
        const client = new Client(dataSourceOptions);
        await client.connect();

        db = drizzle(client);
        Logger.info(`Connected to ${CONFIG.WEB.DATABASE_WEB_TYPE} database ${CONFIG.WEB.DATABASE_WEB_NAME} at ${CONFIG.WEB.DATABASE_WEB_HOST}:${CONFIG.WEB.DATABASE_WEB_PORT}`);

        if (CONFIG.WEB.SYNCHRONIZE_ENABLED)
            await runMigrations();
    } catch (error) {
        Logger.error(JSON.stringify(error));

        let e: string = `Could not connect to ${CONFIG.WEB.DATABASE_WEB_TYPE} database ${CONFIG.WEB.DATABASE_WEB_NAME} at ${CONFIG.WEB.DATABASE_WEB_HOST}:${CONFIG.WEB.DATABASE_WEB_PORT}`;
        Logger.error(e);

        process.exit(1);
    }
}

async function runMigrations(): Promise<void> {
    try {
        Logger.info('Running migrations');
        await migrate(db, { migrationsFolder: __dirname + '/migration' });
        Logger.info('Migration successful');
    } catch (error) {
        Logger.error(JSON.stringify(error));

        Logger.error('Migration failed');
        process.exit(1);
    }
}
