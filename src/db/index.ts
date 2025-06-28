import knexLib from 'knex';
import path from 'path';

const knexConfig = {
  client: 'pg',
  connection: {
    host: 'postgres',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    port: 5432
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations')
  }
};

const knex = knexLib(knexConfig);

export default knex;