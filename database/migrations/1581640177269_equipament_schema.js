'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EquipamentSchema extends Schema {
  up () {
    this.create('equipaments', (table) => {
      table.increments()
      table
        .integer('campus_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('campuses')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('equityNumber', 120).notNullable().unique()
      table.string('brand').notNullable()
      table.string('name').notNullable()
      table.string('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('equipaments')
  }
}

module.exports = EquipamentSchema
