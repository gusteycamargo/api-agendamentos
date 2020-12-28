'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlaceSchema extends Schema {
  up () {
    this.create('places', (table) => {
      table.increments()
      table
        .integer('campus_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('campuses')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('name', 100).notNullable().unique()
      table.integer('capacity').notNullable()
      table.string('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('places')
  }
}

module.exports = PlaceSchema
