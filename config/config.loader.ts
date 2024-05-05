import * as fs from 'fs';
import Logger from '../logger/logger';
import { z } from 'zod';

const webConfig = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('production'),
    PORT: z.number().int().nonnegative().lte(65535).default(80),
    PROXY: z.boolean().default(false),

    LOG_ENABLED: z.boolean().default(true),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'verbose', 'debug', 'silly']).default('info'),

    SYNCHRONIZE_ENABLED: z.boolean().default(false),

    DATABASE_WEB_TYPE: z.enum(['mysql', 'postgres']).default('postgres'),
    DATABASE_WEB_USERNAME: z.string(),
    DATABASE_WEB_PASSWORD: z.string(),
    DATABASE_WEB_HOST: z.string(),
    DATABASE_WEB_PORT: z.number(),
    DATABASE_WEB_NAME: z.string(),
});
export type WebConfig = z.infer<typeof webConfig>;

const kafkaConfig = z.object({
    SCHEMA_REGISTRY_HOST: z.string(),
    BROKERS: z.array(z.string()),
    CLIENT_ID: z.string(),
    TOPIC: z.string(),
    GROUP_ID: z.string(),
});
export type KafkaConfig = z.infer<typeof kafkaConfig>;

export type Config = {
    WEB: WebConfig;
    KAFKA: KafkaConfig;
};

const CONFIG_FILE: string = __dirname + '/config.js';

let loadedConfig: any = null;
let loadedValues: any;
try {
    loadedConfig = String(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    Logger.info(`Loaded configuration from ${CONFIG_FILE}`);
} catch (error) {
    // when config file does not exist continue assuming that environment variables are used
    Logger.warn(`Could not load configuration from ${CONFIG_FILE}`);
    loadedConfig = null;
}

if (loadedConfig != null) {
    try {
        // eval of config file content should export module.exports.CONFIG
        // tslint:disable-next-line:no-eval
        eval(loadedConfig);
        if (!module.exports.CONFIG)
            throw new Error();

        loadedValues = module.exports.CONFIG;
    } catch (error) {
        Logger.warn(`Could not parse configuration from ${CONFIG_FILE}`);
    }
}

/////////////////////////////////////
// Create Web Config, override from environment
/////////////////////////////////////

const envValues = process.env;

function parseBool(value: string | boolean | undefined): boolean | undefined {
    if (typeof value === 'undefined')
        return undefined;
    if (typeof value === 'boolean')
        return value;
    return value === 'true';
}

const webConfigWrapper = webConfig.safeParse({
    NODE_ENV: envValues.NODE_ENV || loadedValues.NODE_ENV,
    PORT: parseInt(envValues.PORT || loadedValues.PORT || '80', 10),
    PROXY: parseBool(envValues.PROXY || loadedValues.PROXY || false),
    LOG_ENABLED: parseBool(envValues.LOG_ENABLED || loadedValues.LOG_ENABLED),
    LOG_LEVEL: envValues.LOG_LEVEL || loadedValues.LOG_LEVEL || 'info',
    SYNCHRONIZE_ENABLED: parseBool(envValues.SYNCHRONIZE_ENABLED || loadedValues.SYNCHRONIZE_ENABLED),
    DATABASE_WEB_TYPE: envValues.DATABASE_WEB_TYPE || loadedValues.DATABASE_WEB_TYPE || 'postgres',
    DATABASE_WEB_USERNAME: envValues.DATABASE_WEB_USERNAME || loadedValues.DATABASE_WEB_USERNAME,
    DATABASE_WEB_PASSWORD: envValues.DATABASE_WEB_PASSWORD || loadedValues.DATABASE_WEB_PASSWORD,
    DATABASE_WEB_HOST: envValues.DATABASE_WEB_HOST || loadedValues.DATABASE_WEB_HOST,
    DATABASE_WEB_PORT: parseInt(envValues.DATABASE_WEB_PORT || loadedValues.DATABASE_WEB_PORT, 10),
    DATABASE_WEB_NAME: envValues.DATABASE_WEB_NAME || loadedValues.DATABASE_WEB_NAME,
});

if (!webConfigWrapper.success) {
    let e: string = `Configuration validation error: ${webConfigWrapper.error}`;
    Logger.error(e);
    process.exit(1);
}

const kafkaConfigWrapper = kafkaConfig.safeParse({
    SCHEMA_REGISTRY_HOST: envValues.SCHEMA_REGISTRY_HOST || loadedValues.SCHEMA_REGISTRY_HOST,
    BROKERS: envValues.BROKERS ? envValues.BROKERS.split(',') : loadedValues.BROKERS,
    CLIENT_ID: envValues.CLIENT_ID || loadedValues.CLIENT_ID,
    TOPIC: envValues.TOPIC || loadedValues.TOPIC,
    GROUP_ID: envValues.GROUP_ID || loadedValues.GROUP_ID,
});

if (!kafkaConfigWrapper.success) {
    let e: string = `Configuration validation error: ${kafkaConfigWrapper.error}`;
    Logger.error(e);
    process.exit(1);
}

const config: Config = {
    WEB: webConfigWrapper.data,
    KAFKA: kafkaConfigWrapper.data,
};

export default config;
