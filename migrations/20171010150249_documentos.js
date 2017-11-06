
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('user', function(table) {
        table.increments('id').primary();
        table.string('username');
        table.string('senha');
        table.string('name');
        table.string('email');
        table.integer('role_id');
        table.timestamps();
    }),

    knex.schema.createTableIfNotExists('documentos', function(table) {
        table.increments('id').primary();
        table.string('nome');
        table.string('tipo');
        table.timestamps();
    }),

    knex.schema.createTableIfNotExists('keyword', function(table) {
        table.increments('id').primary();
        table.string('word');
        table.timestamps();
    }),

    knex.schema.createTableIfNotExists('documento_keyword', function(table) {
        table.integer('documento_id');
        table.integer('keyword_id');
        table.primary(['documento_id', 'keyword_id']);
    })
  ])

};

exports.down = function(knex, Promise) {

};
