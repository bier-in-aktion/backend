import * as esbuild from 'esbuild';
import { esbuildPluginTsc } from './esbuild-plugin-tsc.mjs';

await esbuild.build({
    entryPoints: [
        'server.ts',
    ],
    minify: true,
    treeShaking: true,
    bundle: true,
    platform: 'node',
    outfile: 'dist/server.js',
    tsconfig: 'server/tsconfig.json',
    target: 'node20',
    external: [
        'mongodb' ,
        'mssql' ,
        'oracledb',
        'react-native-sqlite-storage' ,
        'redis' ,
        'sqlite3',
        'sql.js' ,
        'typeorm-aurora-data-api-driver',
        'pg-native',

    ],
    plugins: [
        // Workaround for esbuild not supporting emitDecoratorMetadata
        // https://github.com/evanw/esbuild/issues/257
        esbuildPluginTsc({
            force: 'true',
            tsconfigPath: 'tsconfig.json',
        }),
    ],
})
