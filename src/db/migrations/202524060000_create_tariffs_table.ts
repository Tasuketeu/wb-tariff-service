import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wb_tariffs', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.jsonb('data').notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wb_tariffs');
}