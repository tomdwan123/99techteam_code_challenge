import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('resources', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.string('type').notNullable();
        table.enum('status', ['active', 'inactive', 'pending']).defaultTo('active');
        table.json('metadata');
        table.timestamps(true, true);
        
        // Add indexes for better query performance
        table.index(['type']);
        table.index(['status']);
        table.index(['name']);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('resources');
}
