const CONFIG = {
    /////////////////////////////////////
    //  Configuration for Datapool server
    //  All of these values may be overridden by setting environment variables
    /////////////////////////////////////

    NODE_ENV: 'development',
    PORT: 3000,
    PROXY: false,

    /////////////////////////////////////
    // Logging
    /////////////////////////////////////

    LOG_ENABLED: true,
    LOG_LEVEL: 'debug',
    
    /////////////////////////////////////
    // Website Database
    /////////////////////////////////////
    //
    SYNCHRONIZE_ENABLED: true, 

    DATABASE_WEB_TYPE: 'postgres',
    DATABASE_WEB_USERNAME: 'bia',
    DATABASE_WEB_PASSWORD: 'bia',
    DATABASE_WEB_HOST: 'localhost',
    DATABASE_WEB_PORT: 5432,
    DATABASE_WEB_NAME: 'bia',

    /////////////////////////////////////
    // Kafka
    /////////////////////////////////////

    SCHEMA_REGISTRY_HOST: 'http://localhost:8081',
    BROKERS: [''],
    CLIENT_ID: 'consuumer',
    TOPIC: 't',
    GROUP_ID: 'g',
};
  
module.exports.CONFIG = CONFIG;

