import { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'resource',
        password: process.env.DB_PASSWORD || 'resource',
        database: process.env.DB_NAME || 'resource',
        port: parseInt(process.env.DB_PORT || '5432'),
    },
    migrations: {
      directory: 'migrations',
    },
    seeds: {
        directory: 'seeds',
    },
};

export default config;