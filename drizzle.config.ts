import type { Config } from 'drizzle-kit';
import CONFIG from './config/config.loader';

export default {
    schema: './database/schema/*-schema.ts',
    out: './database/migration',
    driver: 'pg',
    dbCredentials: {
        host: CONFIG.WEB.DATABASE_WEB_HOST,
        port: CONFIG.WEB.DATABASE_WEB_PORT,
        user: CONFIG.WEB.DATABASE_WEB_USERNAME,
        password: CONFIG.WEB.DATABASE_WEB_PASSWORD,
        database: CONFIG.WEB.DATABASE_WEB_NAME,
    },
} satisfies Config;
