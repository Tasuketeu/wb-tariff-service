import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: 'postgres',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'postgres'
    },
    migrations: {
      directory: './src/db/migrations'
    }
  }
};

export default config;